#!/bin/bash
cd "$(dirname "$0")"
mkdir -p templates
cp webapp/src/client/index.html templates/
cp -r webapp/src/client/public .

sed -E -i -- 's/"localhost"|\x27localhost\x27/window.location.hostname == "" ? "localhost" : window.location.hostname/g' public/bundle.js
sed -i -- 's_"http://localhost:9200"_window.location.protocol+"//"+window.location.hostname+(window.location.port == "" ? "" : ":"+window.location.port)_g' public/bundle.js
## comment to use without gzip compression
gzip -k -f public/bundle.js 