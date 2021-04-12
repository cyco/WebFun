Tiles
=====

The desktop adventure games use tiles as the fundamental elements for graphics. Maps, enemies and bullets are all made up of tiles.

In the assets file each tile consists of `4`-byte tile attributes and `32*32` bytes image data. The number of tiles can be calculated by dividing the size of the TILE category by `1028` like `count = size / (32 * 32 + 4)`. Each byte in the pixel data is an index into the color palette.

### General Atrributes

| bit         | Name                     | Description                                            |
|-------------|--------------------------|--------------------------------------------------------|
| 0           | Transparent              | if set color 0 in pixel data is treated as transparent |
| 1           | Floor                    | Tile is usually placed on the lowest layer             |
| 2           | Object                   | Tile is normally placed on the middle                  |
| 3           | Draggable                | If set the tile can be                                 |
| 4           | Roof                     | Object is usually placed on the top-m                  |
| **Type**    |                          |                                                        |
| 5           | Locator                  | Tile where only 28x28 pixels are visi                  |
| 6           | Weapon                   |                                                        |
| 7           | Item                     |                                                        |
| 8           | Character                | If the flag is not set, an enemy can                   |
|             |                          |                                                        |
| ### Floor   |                          |                                                        |
|             |                          |                                                        |
| bit         | Name                     | Description                                            |
| -----       | -----------              | ---------------------------------------------          |
| 16          | Doorway                  | These tile are doorways, monsters can't go t           |
|             |                          |                                                        |
| ### Locator |                          |                                                        |
|             |                          |                                                        |
| bit         | Name                     |                                                        |
| -----       | ------------------------ |                                                        |
| 17          | Town                     |                                                        |
| 18          | PuzzleUnsolved           |                                                        |
| 19          | PuzzleSolved             |                                                        |
| 20          | TravelUnsolved           |                                                        |
| 21          | TravelSolved             |                                                        |
| 22          | BloackadeNorthUnsolved   |                                                        |
| 23          | BloackadeSouthUnsolved   |                                                        |
| 24          | BloackadeWestUnsolved    |                                                        |
| 25          | BloackadeEastUnsolved    |                                                        |
| 26          | BloackadeNorthSolved     |                                                        |
| 27          | BloackadeSouthSolved     |                                                        |
| 28          | BloackadeWestSolved      |                                                        |
| 29          | BloackadeEastSolved      |                                                        |
| 30          | Goal                     |                                                        |
| 31          | YouAreHere               |                                                        |

### Item

These flags are used in hints in the map screen, and in R2D2's help messages.

| bit | Name     | Description                                                                                      |
|-----|----------|--------------------------------------------------------------------------------------------------|
| 16  | Keycard  |                                                                                                  |
| 17  | Tool     |                                                                                                  |
| 18  | Part     |                                                                                                  |
| 19  | Valuable |                                                                                                  |
| 20  | Map      |                                                                                                  |
| 22  | Edible   | Medikits and other health items have this flag, their health bonus is hard coded in Yoda Stories |

### Weapon

| bit | Name        |
|-----|-------------|
| 16  | BlasterLow  |
| 17  | BlasterHigh |
| 18  | Lightsaber  |
| 19  | TheForce    |

### Character

| bit | Name  |
|-----|-------|
| 16  | Hero  |
| 17  | Enemy |
| 18  | NPC   |
