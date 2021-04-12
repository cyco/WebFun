File Format
===========

Most of the assets used by the game is stored in a file called `Yodesk.dta` or `Desktop.daw`. Both follow the same structure, but the `daw` format is a little bit simpler.

The central structure is a list of consecutive catalog entries. Each entry has a 4-byte identifier, 4-byte size attribute and `size - 8`-bytes content. The structure of the content is different for each category. The end of the list is marked with an entry named `ENDF`.

Note that the section `VERS` always holds `512` in `size` and has no body. Similarly in Yoda Stories' `dta` format, the `ZONE` section identifier is followed by 2 bytes specifying the zone count instead of the size of the entry.

A machine-readable definition of the file format can be found [here](./yodesk.ksy). You can use `kaitai-struct` to generate parsers for a wide variety of programming languages.

See the following table for a list of sections seen in the wild. The column *dta* specifies if a section is used in the Yoda Stories file format. `inlined` means the data is present but merged into the `ZONE` section instead of an entry at the root of the catalog.

| Identifier |  dta      |  Description                                                                                                                                     |
|------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| VERS       |           | File format version. Data (always `512`) is stored in size attribute                                                                             |
| STUP       |           | 288x288px image shown while loading rest of the file                                                                                             |
| SNDS       |           | List of sounds                                                                                                                                   |
| TILE       |           | Tiles                                                                                                                                            |
| ZONE       |           | Zones                                                                                                                                            |
| PUZ2       |           | Puzzles                                                                                                                                          |
| CHAR       |           | Characters and weapons                                                                                                                           |
| CHWP       |           | Contains health and weapon for characters, firing sound for weapons                                                                              |
| CAUX       |           |  Damage of the weapon or enemy                                                                                                                   |
| TNAM       |           |  Tile names, as shown in inventory and in dialogs                                                                                                |
| ZAUX       | *inlined* | Additional zone info, contains monsters and item ids required to solve                                                                           |
| ZAX2       | *inlined* | Additional zone info, item ids provided by the zones, npc ids                                                                                    |
| ZAX3       | *inlined* | Additional zone info, npc ids that can be placed on the zone                                                                                     |
| ZAX4       | *inlined* | Additional zone info, purpose unknown                                                                                                            |
| HTSP       | *inlined* | Hotspots, locations of triggers and items drops on zones                                                                                         |
| ACTN       | *inlined* | Actions, interactive scripts per zone                                                                                                            |
| ZNAM       | *missing* |  Zone names                                                                                                                                      |
| PNAM       | *missing* |  Puzzle names                                                                                                                                    |
| ANAM       | *missing* |  Action names                                                                                                                                    |
| TGEN       |           | Purpose unclear, probably something to do with translations                                                                                      |
| ENDF       |           | Marks end of the archive. Subsequent categories are ignored and could be used to store non-standard data (e.g. Action source from WebFun editor) |

Visualization of the `dta` file format
--------------------------------------

![yodesk.ksy.svg](../images/yodesk.svg)
