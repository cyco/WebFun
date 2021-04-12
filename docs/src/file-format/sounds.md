Sounds
======

The `SNDS` section starts off with a `2`-byte count of the sounds stored in the section. For some reason the count is stored as a negative value. After the count it's just a list of consecutive strings of sound files. Each string is stored with a `2`-byte length prefix and a c-style `nul` terminator and seems to be encoded in `ISO-8859-2`. The index of a string is used throughout the game to identify a sound. Some of them, like the `hurt` sound are even hard-coded in the game.

> **Note**: *Indy's Desktop Adventures* format stores absolute paths as sound names, but when loading sounds it just looks up the file name in the game's directory.
