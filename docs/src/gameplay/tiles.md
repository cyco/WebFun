Tiles
=====

|                              |
|:----------------------------:|
| ![](../images/tile-grid.png) |

The Desktop Adventures engine is almost entirely tile based. That means small re-usable images are used as the fundamental elements for all graphics. Maps, enemies and bullets are all made up of tiles.

> **Note:** Only the startup image and the speech bubbles are not rendered using tiles.

Each tile is made up of `32x32` pixels image data – an array of `8`-bit color palette indexes – and some flags that specify the properties of the tile.

### General Attributes

| bit      | Name        | Description                                            |
|----------|-------------|--------------------------------------------------------|
| 0        | Transparent | if set color 0 in pixel data is treated as transparent |
| 1        | Floor       | Tile is usually placed on the lowest layer of a zone   |
| 2        | Object      | Tile is normally placed on the middle                  |
| 3        | Draggable   | If set the tile can be dragged and pushed              |
| 4        | Roof        | Object is usually placed on the top layer              |
| **Type** |             |                                                        |
| 5        | Locator     | Tiles used in map screen                               |
| 6        | Weapon      | Weapon tiles                                           |
| 7        | Item        | Items                                                  |
| 8        | Character   | If the flag is not set, an enemy can                   |

### Floor

| bit | Name      | Description                                |
|-----|-----------|--------------------------------------------|
| 16  | Doorway   | These tile are doorways, monsters can't go |

### Locator

If the `Locator` type bit is set, these flags specify the sub-type. Some tiles required to render the map scene are not marked with special bit flags, so a hard coded list of tile ids per game is required.

| bit | Name                   | Description                                                                                                                                                  |
|-----|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 17  | Town                   | Marks the Spaceport or Lucasino                                                                                                                              |
| 18  | PuzzleUnsolved         | A visited sector with a puzzle that has not been solved yet                                                                                                  |
| 19  | PuzzleSolved           | A solved sector                                                                                                                                              |
| 20  | TravelUnsolved         | Sector that brings to player to a section of the world that can not be reached otherwise.                                                                    |
| 21  | TravelSolved           |                                                                                                                                                              |
| 22  | BloackadeNorthUnsolved | A puzzle that has to be solved before the sectors to the north can be reached. A sector that has to be solved before the sector to the north can be reached. |
| 23  | BloackadeSouthUnsolved |                                                                                                                                                              |
| 24  | BloackadeWestUnsolved  |                                                                                                                                                              |
| 25  | BloackadeEastUnsolved  |                                                                                                                                                              |
| 26  | BloackadeNorthSolved   |                                                                                                                                                              |
| 27  | BloackadeSouthSolved   |                                                                                                                                                              |
| 28  | BloackadeWestSolved    |                                                                                                                                                              |
| 29  | BloackadeEastSolved    |                                                                                                                                                              |
| 30  | GoalUnsolved           | The final puzzle of the world. Solving this wins the game                                                                                                    |
| 31  | YouAreHere             | Overlay to mark the current position                                                                                                                         |

### Item

These item flags are used in hints in the map screen, and in R2D2's help messages.

| bit | Name     | Description                                                                                      |
|-----|----------|--------------------------------------------------------------------------------------------------|
| 16  | Keycard  |                                                                                                  |
| 17  | Tool     |                                                                                                  |
| 18  | Part     |                                                                                                  |
| 19  | Valuable |                                                                                                  |
| 20  | Map      |                                                                                                  |
| 22  | Edible   | Medikits and other health items have this flag, their health bonus is hard coded in Yoda Stories |

### Weapon

| bit | Name        | Description                |
|-----|-------------|----------------------------|
| 16  | BlasterLow  | Blaster Pistol             |
| 17  | BlasterHigh | Blaster Rifle              |
| 18  | Lightsaber  | Lightsaber (Blue or Green) |
| 19  | TheForce    | The Force                  |

### Character

| bit | Name  | Description |
|-----|-------|-------------|
| 16  | Hero  |             |
| 17  | Enemy |             |
| 18  | NPC   |             |
