import EndingIs from "src/engine/script/conditions/ending-is";

describeCondition("EndingIs", (check, engine) => {
	it("evaluates to true if the story's ending drops the item specified in `arg_0`", async () => {
		const condition: any = { opcode: EndingIs.Opcode, arguments: [0x12] };

		engine.story = { goal: { item1: { id: 0x12 } } } as any;
		expect(await check(condition)).toBeTrue();

		engine.story = { goal: { item1: { id: 0x15 } } } as any;
		expect(await check(condition)).toBeFalse();
	});
});
