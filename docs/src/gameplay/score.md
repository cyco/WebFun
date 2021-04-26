Score
-----

At the end of each game a score called the *Indy Quotient* or *Force Factor* is calculated. The game keeps track of the last and highest scores in the ini file at `C:/WINDOWS/Yodesk.ini` (see [files/yodesk-ini.md](../files/yodesk-ini.md)) using the keys `HScore` and `LScore`, respectively.

![you-win](../images/yoda-win.png)

The game combines four components to rate the player's performance:

-	Time
-	Solved puzzle ratio
-	Difficulty
-	Visited zones

### Time:

```javascript
const time = (baseTime in seconds + elapsedTime in seconds) / 60 - 5 * worldSize
if time <= 0 return 200
if 20 * time < 200
	return 200 - 20 * time
return 0
```

### Puzzles:

```javascript
const solved = sectors.filter(zone => zone && zone.visited).length
return solved / worldSize * 100.0
```

### Difficulty:

```javascript
const solved = sectors.filter(zone => zone && zone.visited && zone.solved).length
const total = sectors.length
return solved / worldSize * 100.0
```

### Visited Zones:

```javascript
const solved = sectors.filter(zone => zone && zone.visited).length
return solved / worldSize * 100.0
```

### Final Score:

```javascript
return Sum(components)
```
