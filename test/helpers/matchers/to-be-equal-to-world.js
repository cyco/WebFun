import addMatchers from 'add-matchers';

addMatchers({
	toBeEqualToWorld: (actual, received) => {
		
		for (let i = 0; i < 100; i++) {
			let thing = received[i];
			
			if (thing.zoneId !== actual[i * 10]) return false;
			if (thing.zoneType !== actual[i * 10 + 1]) return false;
			// if (thing.findItemID !== sample[i * 10 + 6]) return;
			// if (thing.requiredItemID !== sample[i * 10 + 4]) return;
		}
		
		return true;
	}
});
