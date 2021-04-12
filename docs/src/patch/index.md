The Patch
---------

Lucas Arts released a patch called *Yoda Update patch \#6* that fixes problems in some zones. The Patch is just a self-extracting archive that replaces the main game data file `Yodesk.dta`. A prompt saying *zones [\#72](./zone-072.md), [\#236](./zone-236.md), [\#407](./zone-407.md), [\#474](./zone-474.md) and [\#572](./zone-572.md) have been fixed* appears when the update is run.

It would be interesting to find out what was changed in those zones.

```bash
$ shasum yopatch6.exe
a8e18864184d49feaf0b74b93f60855f40ffe9bf  yopatch6.exe

$ file yopatch6.extension
yopatch6.exe: PE32 executable (GUI) Intel 80386, for MS Windows
```

The original update page has been preserved in the Wayback Machine [here](https://web.archive.org/web/20000304052609/http://support.lucasarts.com/patches/yoda.htm) (newer design [here](https://web.archive.org/web/20011014162056/http://support.lucasarts.com:80/patches/yoda.htm)). The page dates the update to February of 97 and says that it contains "minor art modifications" in addition to the zone fixes.

#### TODO

-	[ ] diff original and updated game files
-	[ ] check if anything outside of those zones changed
-	[ ] document tile changes
-	[ ] document actions that changed
-	[ ] find out how to extract installer using JS

![Patched_Zones](../images/patched-zones.png)
