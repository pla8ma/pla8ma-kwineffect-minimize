# Pla8ma minimize animation for KDE Plasma

> **Info:** highly AI-generated.

A minimize effect for KDE Plasma 6, based on KWin's former JavaScript
Squash effect: the window shrinks to just above its taskbar button while it
fades out, and grows back from there when restored.

Works with Plasma 6.6, 6.7 and 6.8. The taskbar has to tell KWin where its
buttons are; Plasma's own task manager does. Windows without a taskbar
button are minimized without animation.

## Install

It is a scripted effect, so there is nothing to compile:

```bash
./install.sh
```

The script switches the effect on and turns off Squash and Magic Lamp, as
only one minimize animation can run at a time. You can change this in
System Settings > Window Management > Desktop Effects.

## Uninstall

```bash
./uninstall.sh
```

This removes the effect and switches KDE's Squash effect back on.

## Credits

Based on the former JavaScript version of the Squash effect of
[KWin](https://invent.kde.org/plasma/kwin)
([source](https://invent.kde.org/plasma/kwin/-/tree/master/src/plugins/squash)),
by Vlad Zahorodnii. Thanks to them and the KDE community.

## License

GPL-2.0-or-later, like KWin's Squash effect it is based on.
