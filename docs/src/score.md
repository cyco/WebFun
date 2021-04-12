Score
-----

At the end of each game a score called the *Force Factor* is calculated. The game keeps track of the last and highest scores in the ini file at `C:/WINDOWS/Yodesk.ini` using the keys `HScore` and `LScore`, respectively.

![you-win](images/you-win.png)

To calculate the score the game combines four components:

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
const solved = worldSpots.filter(zone => zone && zone.visited).length
return solved / worldSize * 100.0
```

### Difficulty:

```javascript
const solved = worldSpots.filter(zone => zone && zone.visited && zone.solved).length
const total = worldSpots.length
return solved / worldSize * 100.0
```

### Visited Zones:

```javascript
const solved = worldSpots.filter(zone => zone && zone.visited).length
return solved / worldSize * 100.0
```

### Final Score:

```javascript
return Sum(components)
```
