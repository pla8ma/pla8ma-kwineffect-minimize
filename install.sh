#!/usr/bin/env bash
# Installs (or updates) the minimize effect for KWin for the current
# user and switches it on in place of the other minimize animations.
set -euo pipefail

cd "$(dirname "$0")"

ID="kwineffect_pla8ma_minimize"

if kpackagetool6 -t KWin/Effect --show "$ID" >/dev/null 2>&1; then
    kpackagetool6 -t KWin/Effect --upgrade package
else
    kpackagetool6 -t KWin/Effect --install package
fi

# One minimize animation at a time (as the effect settings do).
kwriteconfig6 --file kwinrc --group Plugins --key "${ID}Enabled" true
kwriteconfig6 --file kwinrc --group Plugins --key squashEnabled false
kwriteconfig6 --file kwinrc --group Plugins --key magiclampEnabled false

# Swap the effects in the running KWin (reconfiguring alone does not load
# a newly installed effect).
effects() {
    gdbus call --session -d org.kde.KWin -o /Effects -m "org.kde.kwin.Effects.$1" "$2" >/dev/null 2>&1 || true
}
effects unloadEffect squash
effects unloadEffect magiclamp
effects unloadEffect "$ID"
effects loadEffect "$ID"

echo
echo "Installed and switched on (System Settings > Window Management > Desktop Effects)."
