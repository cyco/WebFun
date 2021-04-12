Yodesk.ini
==========

Data that persists between launches of *Yoda Stories*, like settings, highscore and information about the last generated worlds is stored in a file at `C:\Windows\Yodesk.ini`.

The file is a standard [INI file](https://en.wikipedia.org/wiki/INI_file) with the sections `OPTIONS` and `GameData` and might look like this:

```ini
[OPTIONS]
MIDILoad=1
PlaySound=0
PlayMusic=0
Difficulty=1
GameSpeed=140
WorldSize=1
Count=302
HScore=870
LScore=570
LCount=0
Terrain=2

[GameData]
Alaska0=2126634910,129,3,318,232,264
Nevada0=950869581,163,3,364,348,362
```

Options section
---------------

| Key                  | Description                                                                              |
|----------------------|------------------------------------------------------------------------------------------|
| **Settings**         |                                                                                          |
| MIDILoad             |                                                                                          |
| PlaySound            | Setting                                                                                  |
| PlayMusic            | Setting                                                                                  |
| Difficulty           | Setting, values range from                                                               |
| GameSpeed            | Setting, values range from                                                               |
| WorldSize            | Setting, values range from                                                               |
| **Score**            |                                                                                          |
| Count                | Number of worlds generated                                                               |
| HScore               | Highest score                                                                            |
| LScore               | Last score                                                                               |
| LCount               | Number of lost games                                                                     |
| **World Generation** |                                                                                          |
| Terrain              | Last terrain used to generate a world. The next world is determined based on this value. |

GameData section
----------------

The `GameData` section is to keep track of the zones last used on each planet. When a new world on the planet is generated, these zones are excluded. This is increases variety between consecutive games.

Each entry holds a comma separated list. The first entry is **TODO** while the rest specifies which puzzles were used in that world.

| Key     | Mapping                  |
|---------|--------------------------|
| Alaska0 | Ice planet (Hoth)        |
| Nevada0 | Desert planet (Tatooine) |
| Oergon0 | Forest planet (Endor)    |
