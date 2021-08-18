import EndingIs from "src/engine/script/conditions/ending-is";

describeCondition("EndingIs", (check, engine) => {
	it("evaluates to true if the story's ending drops the item specified in `arg_0`", async () => {
		const condition: any = { opcode: EndingIs.Opcode, arguments: [18] };

		engine.story = { goal: { item1: { id: 18 } } } as any;
		expect(await check(condition)).toBeTrue();

		engine.story = { goal: { item1: { id: 21 } } } as any;
		expect(await check(condition)).toBeFalse();
	});
});
