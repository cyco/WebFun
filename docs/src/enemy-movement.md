Enemy Movement
--------------

Enemies move in different patterns, each of the pattern is specified by a `movement type` field in the `char` entry.

The following movement types are defined.

-	`0x0000` - weapon
	-	only used for weapons
	-	renders enemies as Tile 0
	-	game crashes
-	`0x0001`

	-	enemies seem very aggressive
	-	follow player around the map
	-	get really close

-	`0x0002`

	-	run away from player?
	-	looks like they are on retreat

-	`0x0003`

	-	nothing special
	-	mostly stay away but get up close on occasion

-	`0x0004` - *sit*

	-	no movement
	-	faces hero (prefer y, left / right only if y matches)
	-	attacks when in range

-	`0x0006`

	-	enemies keep a distance
	-	still stay visible and pretty close

-	`0x0007`

	-	similar to 0x0002

-	`0x0008`

	-	fast movement
	-	hectic
	-	similar to 0x0002 again

-	`0x0009` (wander)

-	`0x000a` (patrol)

	-	like sit
	-	only faces player on direct x/y match
	-	allows sneaking up on diagonal tiles

-	`0x000b`

	-	lots of turning (synchronized)
	-	shy away if player is too close (y axis only)
	-	look at player on x match (also synchronized sometimes)
	-	shoot when player is in range

-	`0x000c - Animation`

	-	cycles through direction tiles 0 to 5 repeatedly
	-	order: `up, down, top left, left, bottom left, bottom, top right` (`frames[idx mod 6]`\)
	-	used for animation
	-	could be used to create destroyable objects
	-	animation can be stopped by disabling enemy
