export const PrepareExpectations = (string) => {
	return string.split("\n");
};

export const ParseExpectation = (expectation, line) => {
	try {
		return JSON.parse(expectation);
	} catch (e) {
		if (line !== undefined)
			console.warn(`Unable to parse expectation at line ${line}!`);
		else
			console.warn(`Unable to parse expectation!`);
	}
	return {seed: -1};
};

export const ComparisonResult = {
	Equal: 0,
	Different: 1,
	Similar: 2
};

export const CompareWorldItems = (item1, item2) => {
	if (item1.zoneID === item2.zoneID && item1.zoneID === -1) return ComparisonResult.Equal;

	if (item1.zoneID !== item2.zoneID) return ComparisonResult.Different;
	if (item1.zoneType !== item2.zoneType) return ComparisonResult.Different;

	if (item1.findItemID !== item2.findItemID) return ComparisonResult.Different;
	if (item1.requiredItemID !== item2.requiredItemID) return ComparisonResult.Different;
	if (item1.npcID !== item2.npcID) return ComparisonResult.Different;
	if (item1.additionalRequiredItemID !== item2.additionalRequiredItemID) return ComparisonResult.Different;

	return ComparisonResult.Equal;
};
