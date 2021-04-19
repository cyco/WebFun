The Patch
---------

In February of '97 Lucas Arts released a patch called *Yoda Update \#6* that fixes problems in some zones. The Patch is a self-extracting archive that replaces the main game data file `Yodesk.dta` with a new one.

A prompt saying *zones [\#72](./zone-072.md), [\#236](./zone-236.md), [\#407](./zone-407.md), [\#474](./zone-474.md) and [\#572](./zone-572.md) have been fixed* appears when the update is run.

![Message shown when Yoda Update \#6 is run](../../images/patched-zones.png)

The original release notes of `yopatch6.exe` have been preserved by the Wayback Machine [here](https://web.archive.org/web/20000304052609/http://support.lucasarts.com/patches/yoda.htm) (and with a different design [here](https://web.archive.org/web/20011014162056/http://support.lucasarts.com:80/patches/yoda.htm)). They claim that in addition to the zone fixes "minor art modifications" have been made.

It would be interesting to find out what exactly has changed in the newer data file.

```bash
$ shasum yopatch6.exe
a8e18864184d49feaf0b74b93f60855f40ffe9bf  yopatch6.exe

$ file yopatch6.exe
yopatch6.exe: PE32 executable (GUI) Intel 80386, for MS Windows
```
