R2D2 Help
=========

![](../images/r2d2-help.png)

When Luke first visits *Dagobah* his trusty companion *R2-D2* is already waiting for him, ready to be picked up and help out.

R2D2 can be placed anywhere on the game screen and will try to give some information on whatever it was dropped on.

The messages given by R2 are stored as string resources in the executable.

The following string ids are used:

| String | Hint               | Description                                                           |
|--------|--------------------|-----------------------------------------------------------------------|
| 57383  | AboutWalking       | Chosen at random if no other message matches                          |
| 57384  | AboutFinding       | Chosen at random if no other message matches                          |
| 57385  | About Using        | Chosen at random if no other message matches                          |
| 57386  | About Weapons      | Chosen at random if no other message matches                          |
| 57387  | AboutHealth        | Chosen at random if no other message matches                          |
| 7382   | Yoda               | Shown when placed on Yoda                                             |
| 7395   | Hero               | Shown when placed on Luke                                             |
| 7388   | Vader              | Shown when placed on Vader                                            |
| 7398   | MedicalDroid       | Shown when placed on medial droid                                     |
| 7396   | TeleporterActive   | Shown when placed on an active teleporter                             |
| 7397   | TeleporterInactive | Shown when placed on an inactive teleporter                           |
| 7380   | Draggable          | Shown when placed on a tile with the `Draggable` flag                 |
| 7400   | Weapon             | Show when placed on a tile with the `Weapon` flag                     |
| 7378   | Enemy              | Shown when placed on a tile with the `Character` and `Enemy` flags    |
| 7381   | NPC                | Shown when placed on a tile with the `Character` and `NPC` attributes |
| 7391   | Ewok               | Shown when placed on an Ewok                                          |
| 7392   | Jawa               | Shown when placed on a friendly Jawa                                  |
| 7393   | Droid              | Shown when placed on a droid (tile ids hard coded)                    |
| 7377   | X-Wing             | Shown when placed on an X-Wing tile (not actually triggered)          |
| 7376   | Storage            | Shown when placed on a container (hard coded tile ids)                |
| 7379   | Door               | Show when placed on a door tile (hard coded list of tile ids)         |
| 7389   | Win                | Shown when game is won (can not be triggered)                         |
| 7390   | Lose               | Shown when game is lost (can not be triggered)                        |

#### List of Storage Tile IDs

```json
[0x102, 0x10, 0x48d, 0x279, 0x27b, 0x27c, 0x6e5]
```

#### List of Door IDs

```json
[70, 71, 72, 73, 74, 75, 76, 145, 149, 152, 153, 220, 221, 223, 231, 232, 233, 350, 582, 584, 586, 588, 702, 709, 755, 756, 759, 760, 804, 806, 983, 984, 1047, 1048, 1081, 1112, 1120, 1259, 1461, 1462, 1472, 1473, 1539, 1544, 1858]
```

#### List of X-Wing Tile IDs

```json
[0x3b4, 0x3b5, 0x3b6]
```
