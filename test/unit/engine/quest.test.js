import Quest from '/engine/quest';

describe('Quest', () => {
	it('is a simple storage for itemID and maxiumum distance, used in world generation', () => {
		let itemID = 0x123;
		let distance = 5;
		let quest = new Quest(itemID, distance);
		
		expect(quest.itemID).toBe(itemID);
		expect(quest.unknown).toBe(distance);
	});
});
