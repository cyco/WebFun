import HasGoalItem from "src/engine/script/conditions/has-goal-item";

describeCondition("HasGoalItem", (check, engine) => {
	it("returns true if hero has the item provided by the goal zone", async () => {
		(engine.story.goal as any).item1 = { id: 1 };
		const condition: any = { opcode: HasGoalItem.Opcode, arguments: [] };
		expect(await check(condition)).toBeFalse();

		engine.inventory.addItem(engine.story.goal.item1);
		expect(await check(condition)).toBeTrue();
	});
});
