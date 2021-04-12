| Opcode | Name                | # of arguments | Description                                                                                                                                                      |
| ------ | ------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0x000  | PlaceTile           | 4              | Place tile `arg_3` at `arg_0`x`arg_1`x`arg_2`. To remove a tile the id -1 is used.                                                                               |
| 0x001  | RemoveTile          | 3              | Remove tile at `arg_0`x`arg_1`x`arg_2`                                                                                                                           |
| 0x002  | MoveTile            | 5              | Move Tile at `arg_0`x`arg_0`x`arg_2` to `arg_3`x`arg_4`x`arg_2`. _Note that this can not be used to move tiles between layers!_                                  |
| 0x003  | DrawTile            | -1             |
| 0x004  | SpeakHero           | 0              | Show speech bubble next to hero. _Uses `text` attribute_.                                                                                                        |
| 0x005  | SpeakNPC            | 2              | Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.                                                                                                  |
| 0x017  | EnableNPC           | 1              | Enable NPC `arg_0`                                                                                                                                               |
| 0x018  | DisableNPC          | 1              | Disable NPC `arg_0`                                                                                                                                              |
| 0x019  | EnableAllNPCs       | 0              | Enable all NPCs                                                                                                                                                  |
| 0x01a  | DisableAllNPCs      | 0              | Disable all NPCs                                                                                                                                                 |
| 0x006  | SetTileNeedsDisplay | -1             | Redraw tile at `arg_0`x`arg_1`                                                                                                                                   |
| 0x007  | SetRectNeedsDisplay | -1             | Redraw the part of the current scene, specified by a rectangle positioned at `arg_0`x`arg_1` with width `arg_2` and height `arg_3`.                              |
| 0x008  | Wait                | -1             | Pause script execution for 100 \* `arg_0` milliseconds.                                                                                                          |
| 0x009  | Redraw              | -1             | Redraw the whole scene immediately                                                                                                                               |
| 0x00a  | PlaySound           | -1             | Play sound specified by `arg_0`                                                                                                                                  |
| 0x00b  | StopSound           | -1             | Stop playing sounds. \_TODO: check if only music need to be stopped`                                                                                             |
| 0x00c  | RollDice            | 1              | Set current zone's `random` to a random value between 0 and `arg_0`. \_TODO: verify this isn't $0 < random <= arg_0$.                                            |
| 0x00d  | SetCounter          | 1              | Set current zone's `counter` value to a `arg_0`                                                                                                                  |
| 0x00f  | SetVariable         | 4              | Set variable identified by `arg_0`⊕`arg_1`⊕`arg_2` to `arg_3`. Internally this is implemented as opcode 0x00, setting tile at `arg_0`x`arg_1`x`arg_2` to `arg_3` |
| 0x010  | HideHero            | 0              | Hide hero                                                                                                                                                        |
| 0x011  | ShowHero            | 0              | Show hero                                                                                                                                                        |
| 0x012  | SetHero             | 2              | Set hero's position to `arg_0`x`arg_1` ignoring impassable tiles. Execute hotspot actions, redraw the current scene and move camera if the hero is not hidden.   |
| 0x013  | MoveHeroBy          | -1             |
| 0x014  | DisableAction       | 0              | Disable current action                                                                                                                                           |
| 0x016  | DisableHotspot      | 1              | Disable hotspot `arg_0`                                                                                                                                          |
| 0x015  | EnableHotspot       | 1              | Enable hotspot `arg_0`                                                                                                                                           |
| 0x01b  | DropItem            | 3              |
| 0x01c  | AddItem             | 1              | Add item with id `arg_0` to inventory                                                                                                                            |
| 0x01d  | RemoveItem          | 1              | Remove one instance of item `arg_0` from the inventory                                                                                                           |
| 0x021  | ChangeZone          | 3              | Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.                                                                          |
| 0x022  | SetSectorCounter          | 1              | Set current zone's `sector-counter` value to a `arg_0`                                                                                                                  |
| 0x023  | AddToSectorCounter        | 1              | Add `arg_0` to current zone's `sector-counter` value                                                                                                                    |
| 0x024  | SetRandom           | 1              | Set current zone's `random` value to a `arg_0`                                                                                                                   |
| 0x025  | AddHealth           | 1              | Increase hero's health by `arg_0`. New health is capped at hero's max health (0x300).                                                                            |
| 0x00e  | AddToCounter        | 1              | Add `arg_0` to current zone's `counter` value                                                                                                                    |
| 0x020  | LoseGame            | -1             |
| 0x01f  | WinGame             | -1             |
| 0x01e  | MarkAsSolved        | 0              |
