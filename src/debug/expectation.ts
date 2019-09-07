export const PrepareExpectations = (string: string): string[] => {
	return string.split("\n");
};

export const ParseExpectation = (expectation: any, line: number) => {
	try {
		return JSON.parse(expectation);
	} catch (e) {
		if (line !== undefined) console.warn(`Unable to parse expectation at line ${line}!`);
		else console.warn(`Unable to parse expectation!`);
	}
	return { seed: -1 };
};

export const ComparisonResult = {
	Equal: 0,
	Different: 1,
	Similar: 2
};

export const CompareSectors = (item1: any, item2: any): any => {
	if ((item1.zone ? item1.zone.id : -1) === item2.zoneID && item1.zoneID === null)
		return ComparisonResult.Equal;

	if ((item1.zone ? item1.zone.id : -1) !== item2.zoneID) return ComparisonResult.Different;
	if (item1.zoneType && item1.zoneType.rawValue !== item2.zoneType) return ComparisonResult.Different;

	if ((item1.findItem ? item1.findItem.id : -1) !== item2.findItemID) return ComparisonResult.Different;
	if ((item1.requiredItem ? item1.requiredItem.id : -1) !== item2.requiredItemID)
		return ComparisonResult.Different;
	if ((item1.npc ? item1.npc.id : -1) !== item2.npcID) return ComparisonResult.Different;
	if (
		(item1.additionalRequiredItem ? item1.additionalRequiredItem.id : -1) !==
		item2.additionalRequiredItemID
	)
		return ComparisonResult.Different;

	return ComparisonResult.Equal;
};
