Map Screen
==========

![](../images/map-screen.png)

In order for the player to find their way around the world and get some hints on how to solve the puzzles, the game includes a map screen. The screen can be accesses after the player finds the map (aka *Locator*) item.

> *TODO:* Describe how locator texts are determined

Observations
------------

Here are some observations about the map:

-	The map scene uses 28x28 tiles instead of the usual 32x32
-	Inventory allows opening the map by clicking any item that has Bits 7 and 20 set
-	The map can be activated by hitting *L* on the keyboard
-	Hints check tile attributes to determine if something is valuable, a tool, a part, etc.
