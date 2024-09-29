import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

export default class IndicatorPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Command
    const rowCommand = new Adw.ActionRow({
      title: "Command",
      subtitle: "It must return 0 exit code on success",
    });
    group.add(rowCommand);

    const entryCommand = new Gtk.Entry({
      placeholder_text: "ip link show cscotun0",
      text: settings.get_string("cli-command"),
      valign: Gtk.Align.CENTER,
      hexpand: true,
    });

    settings.bind(
      "cli-command",
      entryCommand,
      "text",
      Gio.SettingsBindFlags.DEFAULT,
    );

    rowCommand.add_suffix(entryCommand);
    rowCommand.activatable_widget = entryCommand;

    // Check Frequency
    const rowPeriod = new Adw.ActionRow({
      title: "Check Frequency",
      subtitle: "Seconds",
    });
    group.add(rowPeriod);

    const periodAdjustment = new Gtk.Adjustment({
      value: settings.get_int("period-sec"),
      lower: 1,
      upper: 300,
      step_increment: 1,
    });

    const periodSpinButton = new Gtk.SpinButton({
      adjustment: periodAdjustment,
      numeric: true,
      valign: Gtk.Align.CENTER,
      halign: Gtk.Align.END,
    });

    settings.bind(
      "period-sec",
      periodSpinButton.get_adjustment(),
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );

    rowPeriod.add_suffix(periodSpinButton);
    rowPeriod.activatable_widget = periodSpinButton;

    // Enabled Icon Name
    const rowIconOn = new Adw.ActionRow({
      title: "Enabled Icon Name",
      subtitle: "/usr/share/icons/",
    });
    group.add(rowIconOn);

    const iconOnEntry = new Gtk.Entry({
      placeholder_text: "network-vpn-symbolic",
      text: settings.get_string("icon-name-enabled"),
      valign: Gtk.Align.CENTER,
      hexpand: true,
    });

    settings.bind(
      "icon-name-enabled",
      iconOnEntry,
      "text",
      Gio.SettingsBindFlags.DEFAULT,
    );

    rowIconOn.add_suffix(iconOnEntry);
    rowIconOn.activatable_widget = iconOnEntry;

    // Show Disabled Icon
    const rowShowIconOff = new Adw.ActionRow({
      title: "Show Disabled Icon",
    });
    group.add(rowShowIconOff);

    const toggleIconOff = new Gtk.Switch({
      active: settings.get_boolean("show-disabled-icon"),
      valign: Gtk.Align.CENTER,
    });

    settings.bind(
      "show-disabled-icon",
      toggleIconOff,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    rowShowIconOff.add_suffix(toggleIconOff);
    rowShowIconOff.activatable_widget = toggleIconOff;

    // Disabled Icon Name
    const rowIconOff = new Adw.ActionRow({
      title: "Disabled Icon Name",
      subtitle: "/usr/share/icons/",
    });
    group.add(rowIconOff);

    const iconOffEntry = new Gtk.Entry({
      placeholder_text: "network-vpn-offline-symbolic",
      text: settings.get_string("icon-name-disabled"),
      valign: Gtk.Align.CENTER,
      hexpand: true,
    });

    settings.bind(
      "icon-name-disabled",
      iconOffEntry,
      "text",
      Gio.SettingsBindFlags.DEFAULT,
    );

    rowIconOff.add_suffix(iconOffEntry);
    rowIconOff.activatable_widget = iconOffEntry;

    window.add(page);
  }
}
