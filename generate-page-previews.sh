#!/usr/bin/env bash
set -euo pipefail

mkdir -p previews

google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 \
  --screenshot=previews/fintoo-ai-waitlist-1.png "file://$PWD/fintoo-ai-waitlist-1.html"
google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 \
  --screenshot=previews/fintoo-ai-waitlist-2.png "file://$PWD/fintoo-ai-waitlist-2.html"
google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 \
  --screenshot=previews/fintoo-ai-app.png "file://$PWD/ai-app-page.html"

curl -L --fail -o previews/answers-to-your-money.png \
  "https://image.thum.io/get/width/1440/crop/900/noanimate/https://www.fintoo.in/answers-to-your-money"
curl -L --fail -o previews/waiting-list.png \
  "https://image.thum.io/get/width/1440/crop/900/noanimate/https://www.fintoo.in/waiting-list"
curl -L --fail -o previews/financial-clarity-score.png \
  "https://image.thum.io/get/width/1440/crop/900/noanimate/https://www.fintoo.in/financial-clarity-score"
curl -L --fail -o previews/waitlist.png \
  "https://image.thum.io/get/width/1440/crop/900/noanimate/https://www.fintoo.in/waitlist"
