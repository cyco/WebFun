import HideHero from "src/engine/script/instructions/hide-hero";

describeInstruction("HideHero", (execute, engine) => {
	it("hides the hero", async () => {
		const instruction: any = {};
		instruction.opcode = HideHero.Opcode;
		instruction.arguments = [];

		await execute(instruction);
		expect(engine.hero.visible).toBeFalse();
	});
});
