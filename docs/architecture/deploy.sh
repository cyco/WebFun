#!/usr/bin/env bash

SOURCE="$HOME/Source/webfun"
TARGET="$HOME/Source/webfun-release"

# Stop on errors
set -e

# Clone release branch to $TARGET if it does not exist
if [ ! -d "$TARGET" ]; then
	git clone -b release git@github.com:cyco/WebFun.git "$TARGET"
fi

# Change to project root
cd "$SOURCE"

# Execute full test suite
yarn test:full

# Set environment variable to load game files from archive.org
export WEBFUN_GAMES="[{\"title\":\"Yoda Stories from archive.org\",\"variant\":\"yoda\",\"sfx-format\":\"wav\",\"exe\":\"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2FYodesk.exe\",\"sfx\":\"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2Fsfx%2F\",\"data\":\"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2Fyodesk.dta\",\"help\":\"https://cors.archive.org/download/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso/Yoda%2FYodesk.hlp\"},{\"title\":\"Yoda Stories Demo (archive.org)\",\"variant\":\"yoda-demo\",\"sfx-format\":\"wav\",\"exe\":\"https://cors.archive.org/download/StarWarsYodaStories_1020/YodaDemo.zip/YodaDemo%2FYodaDemo.exe\",\"sfx\":\"https://archive.org/download/StarWarsYodaStories_1020/YodaDemo.zip/YodaDemo%2Fsfx%2F\",\"data\":\"https://cors.archive.org/download/StarWarsYodaStories_1020/YodaDemo.zip/YodaDemo%2FYodaDemo.dta\",\"help\":\"https://cors.archive.org/download/StarWarsYodaStories_1020/YodaDemo.zip/YodaDemo%2FYodaDemo.hlp\"}]"

# Run production build
yarn build

# Run production build of documentation
yarn build:docs

# Build docker container for local deployment
# docker build -t webfun:latest .

# Clear out target directory
rm -r "$TARGET"/*

# Copy release files
cp -r build/* "$TARGET"

# Copy screenshots for landing page
cp -r docs/screenshots "$TARGET"/docs/screenshots
cp -r assets/preview.png "$TARGET"/preview.png

# Re-create CNAME to setup custom URL for GitHub pages
echo -n www.webfun.io > "$TARGET"/CNAME

# Change directory for manual inspection
cd "$TARGET"

# Stage new version
git add .

# Give further instructions
echo ""
echo "Your relase is ready. Please inspect changes manually and the run"
echo ""
echo "   cd \"$TARGET\""
echo "   git commit -m \"chore: Update release\""
echo "   git push"
echo ""

