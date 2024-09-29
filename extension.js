import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as QuickSettings from "resource:///org/gnome/shell/ui/quickSettings.js";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import GLib from "gi://GLib";

const ICON_ON = "network-vpn-symbolic";
const ICON_OFF = "network-vpn-offline-symbolic";
const COMMAND = "ip link show cscotun0";

const MyIndicator = GObject.registerClass(
  class MyIndicator extends QuickSettings.SystemIndicator {
    _init() {
      super._init();
      this._indicator = this._addIndicator();
    }
  },
);

export default class IndicatorExtension extends Extension {
  constructor(metadata) {
    super(metadata);
    this._settings = null;
    this._indicator = null;
    this._checkLoop = null;
  }

  async _runCommand() {
    const iconOn = this._settings.get_string("icon-name-enabled") || ICON_ON;
    const iconOff = this._settings.get_string("icon-name-disabled") || ICON_OFF;
    const showIconOff = this._settings.get_boolean("show-disabled-icon");
    const command = this._settings.get_string("cli-command") || COMMAND;
    const [, parsedCommand] = GLib.shell_parse_argv(command);

    try {
      const proc = Gio.Subprocess.new(parsedCommand, Gio.SubprocessFlags.NONE);
      const success = await proc.wait_check_async(null);
      if (success) {
        this._indicator._indicator.icon_name = iconOn;
        this._indicator._indicator.visible = true;
      } else {
        if (showIconOff) {
          this._indicator._indicator.icon_name = iconOff;
          this._indicator._indicator.visible = true;
        } else {
          this._indicator._indicator.visible = false;
        }
      }
    } catch (e) {
      if (showIconOff) {
        this._indicator._indicator.icon_name = iconOff;
        this._indicator._indicator.visible = true;
      } else {
        this._indicator._indicator.visible = false;
      }
    }
  }

  enable() {
    this._settings = this.getSettings();
    this._indicator = new MyIndicator();

    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);

    this._runCommand();
    this._periodSec = this._settings.get_int("period-sec");
    this._checkLoop = GLib.timeout_add_seconds(
      GLib.PRIORITY_DEFAULT,
      this._periodSec,
      () => {
        this._runCommand();
        return GLib.SOURCE_CONTINUE;
      },
    );
  }

  disable() {
    if (this._checkLoop) {
      GLib.Source.remove(this._checkLoop);
      this._checkLoop = null;
    }

    this._settings = null;
    this._indicator.destroy();
    this._indicator = null;
  }
}
