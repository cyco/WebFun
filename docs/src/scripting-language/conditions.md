| Opcode | Name                  | # of arguments | Description                                                                                                                                                                            |
| ------ | --------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0x000  | ZoneNotInitialized    | -1             | Evaluates to true exactly once (used for initialization)                                                                                                                               |
| 0x001  | ZoneEntered           | 0              | Evalutes to true if hero just entered the zone                                                                                                                                         |
| 0x002  | Bump                  | 3              |
| 0x003  | PlaceItem             | -1             |
| 0x004  | StandingOn            | 3              | Check if hero is at `arg_0`x`arg_1` and the floor tile is `arg_2`                                                                                                                      |
| 0x005  | CounterIs             | 1              | Current zone's `counter` value is equal to `arg_0`                                                                                                                                     |
| 0x006  | RandomIs              | 1              | Current zone's `random` value is less equal to `arg_0`                                                                                                                                 |
| 0x007  | RandomIsGreaterThan   | 1              | Current zone's `random` value is greater than `arg_0`                                                                                                                                  |
| 0x008  | RandomIsLessThan      | 1              | Current zone's `random` value is less than `arg_0`                                                                                                                                     |
| 0x009  | EnterByPlane          | 0              |
| 0x00a  | TileAtIs              | 3              | Check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3`                                                                                                                           |
| 0x00b  | NPCIsActive           | 1              | True if npc `arg_0` is alive and well.                                                                                                                                                 |
| 0x00c  | HasNoActiveNPCs       | 0              |
| 0x00d  | HasItem               | 1              | True if inventory contains `arg_0`. If `arg_0` is `-1` check if inventory contains the item provided by the current zone's puzzle                                                      |
| 0x00e  | RequiredItemIs        | -1             |
| 0x00f  | EndingIs              | 1              | True if `arg_0` is equal to current goal item id                                                                                                                                       |
| 0x010  | ZoneIsSolved          | -1             | True if the current zone is solved                                                                                                                                                     |
| 0x011  | Unknown1              | -1             |
| 0x012  | Unknown1Again         | -1             |
| 0x013  | HealthIsLessThan      | 1              | Hero's health is less than `arg_0`.                                                                                                                                                    |
| 0x014  | HealthIsGreaterThan   | 1              | Hero's health is greater than `arg_0`.                                                                                                                                                 |
| 0x015  | Unknown2              | -1             |
| 0x016  | FindItemIs            | 1              | True the item provided by current zone is `arg_0`                                                                                                                                      |
| 0x017  | PlaceItemIsNot        | -1             |
| 0x018  | HeroIsAt              | 2              | True if hero's x/y position is `args_0`x`args_1`.                                                                                                                                      |
| 0x019  | SectorCounterIs             | 1              | Current zone's `sector-counter` value is equal to `arg_0`                                                                                                                                     |
| 0x01a  | SectorCounterIsLessThan     | 1              | Current zone's `sector-counter` value is less than `arg_0`                                                                                                                                    |
| 0x01b  | SectorCounterIsGreaterThan  | 1              | Current zone's `sector-counter` value is greater than `arg_0`                                                                                                                                 |
| 0x01c  | GamesWonIs            | 1              | Total games won is equal to `arg_0`                                                                                                                                                    |
| 0x01d  | DropsQuestItemAt   | 2              |
| 0x01e  | Unknown5              | -1             |
| 0x01f  | CounterIsNot          | 1              | Current zone's `counter` value is not equal to `arg_0`                                                                                                                                 |
| 0x020  | RandomIsNot           | 1              | Current zone's `random` value is not equal to `arg_0`                                                                                                                                  |
| 0x021  | SectorCounterIsNot          | 1              | Current zone's `sector-counter` value is not equal to `arg_0`                                                                                                                                 |
| 0x022  | IsVariable            | 4              | Check if variable identified by `arg_0`⊕`arg_1`⊕`arg_2` is set to `arg_3`. Internally this is implemented as opcode 0x0a, check if tile at `arg_0`x`arg_1`x`arg_2` is equal to `arg_3` |
| 0x023  | GamesWonIsGreaterThan | 1              | Total games won is greater than `arg_0`                                                                                                                                                |
