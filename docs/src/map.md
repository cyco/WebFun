# Map

In order for the player to find their way around the world and get some hints on how to solve the puzzles, the game includes a map screen.
The screen can be accesses after the player finds the map (aka _Locator_) item.

## Observations
Here are some observations about the map:
 - The map scene uses 28x28 tiles instead of the usual 32x32
 - Inventory allows opening the map by clicking any item that has Bits 7 and 20 set
 - The map can be activated by hitting _L_ on the keyboard
 - Activation via the keyboard only works when tile `0x1a5` is in the inventory
 - Mapping from zone type to tile ids is hard coded
 - Hints check tile attributes to determine if something is valuable, a tool, a part, etc.
 - Map tile id is hardcoded for world generation

## Open Questions
 - Does activation via the teleporter hotspot check for the tile id or attributes?
