#!/usr/bin/env bash
set -e

# Download dependencies
which fluidsynth || brew install fluid-synth

if [ ! -d "sfarklib" ]; then
	git clone https://github.com/raboof/sfArkLib.git sfarklib
fi

if [ ! -d "sfarkxtc" ]; then
	git clone https://github.com/raboof/sfarkxtc.git sfarkxtc
fi

if [ ! -d "sfarkxtc" ]; then
	wget -nc http://www.synthfont.com/SoundFonts/FluidR3_GM.sfArk
fi

# Build library for soundfont converter
if [ ! -f "sfarklib/libsfark.dylib" ]; then
	cd sfarklib
	make
	cd ..
fi

# Build soundfont converter
if [ ! -f "sfarkxtc/sfarkxtc" ]; then
	cd sfarkxtc
	CXXFLAGS="-I../sfarklib -L../sfarklib" make
	cd ..
fi

## Convert soundfont from sfark to sf2
if [ ! -f "FluidR3_GM.sf2" ]; then
	DYLD_LIBRARY_PATH=$DYLD_LIBRARY_PATH:sfarklib sfarkxtc/sfarkxtc FluidR3_GM.sfARK FluidR3_GM.sf2
fi

## Finally convert the files
find ../assets/game-data/sfx-* -type f -name '*.MID' -exec fluidsynth -F {}.wav FluidR3_GM.sf2 {} \;
find ../assets/game-data/sfx-* -type f -name '*.wav' -exec lame {} \;
find ../assets/game-data/sfx-* -type f -name '*.MID.wav' -delete

