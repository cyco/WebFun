Palette
=======

Like many 2D games, *Yoda Stories* and *Indy’s Desktop Adventures* use a color palette. That means colors you see on the screen are not specified directly by supplying values for the three components red, green and blue, but rather by supplying an offset into a color palette.

This has two main advantages. First, the amount of data required to specify an image is drastically reduced by 2/3. Second, and more importantly, changing a color in the palette affects all pixels on screen that are using that specific palette spot. This allows for very efficient animations and the results for cleverly composed images are pretty impressive. Check out [this site](http://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html) to see what can be done with palette animations.

Back to *Yoda Stories*, there are several regions in the color palette that are animated during game play to make the environment more lively.

|  *Indy's Desktop Adventures*                                                               |  *Yoda Stories*                                                |
|--------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| ![Color palette used by Indiana Jones and His Desktop Adventures](images/palette-indy.png) | ![Color palette used by Yoda Stories](images/palette-yoda.png) |

Extracting the color palette
----------------------------

The color palette is contained in the `.data` section of the game's executable `Yodesk.exe` as well as the demo `YodaDemo.exe`. Since the exact offset might differ depending on the specific version or language of the game, the easiest way to find it is to locate the string `CDeskcppDoc\0` and extract the next 1024 bytes from there. In most versions the palette seems to start at offset `0x550F0`.

"Free" colors
-------------

The following colors are not referenced by any tile in *Yoda Stories* and could be used for UI elements in restricted environments (e.g. ScummVM or gaming console).

`3, 4, 5, 6, 7, 8, 196, 197, 198, 199, 206, 246, 247, 248, 249, 250, 251, 252, 253, 254`
