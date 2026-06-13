#!/bin/zsh
# Rend chaque slide de slides.html en PNG via Chrome headless.
# Usage : ./rendre.sh [id1 id2 …]  (sans argument : toutes les slides)
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FICHIER="file://$PWD/slides.html"

# id:largeur:hauteur
SLIDES=(
  "profil:1080:1080"
  "c1s1:1080:1350" "c1s2:1080:1350" "c1s3:1080:1350"
  "c1s4:1080:1350" "c1s5:1080:1350" "c1s6:1080:1350"
)

for spec in "${SLIDES[@]}"; do
  id="${spec%%:*}"; reste="${spec#*:}"; w="${reste%%:*}"; h="${reste#*:}"
  if [[ $# -gt 0 ]] && [[ ! " $@ " == *" $id "* ]]; then continue; fi
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size="$w,$h" --screenshot="$PWD/$id.png" \
    --virtual-time-budget=12000 \
    "$FICHIER#$id" 2>/dev/null
  echo "✓ $id.png (${w}×${h})"
done
