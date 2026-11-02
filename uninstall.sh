#!/usr/bin/env bash
# Removes the minimize effect again and switches KDE's Squash back on.
set -uo pipefail

kwriteconfig6 --file kwinrc --group Plugins --key kwineffect_pla8ma_minimizeEnabled --delete
kwriteconfig6 --file kwinrc --group Plugins --key squashEnabled --delete
gdbus call --session -d org.kde.KWin -o /Effects -m org.kde.kwin.Effects.unloadEffect kwineffect_pla8ma_minimize >/dev/null
kpackagetool6 -t KWin/Effect --remove kwineffect_pla8ma_minimize
gdbus call --session -d org.kde.KWin -o /Effects -m org.kde.kwin.Effects.loadEffect squash >/dev/null
