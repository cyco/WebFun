import ShowHero from "src/engine/script/instructions/show-hero";

describeInstruction("ShowHero", (execute, engine) => {
	it("hides the hero", async () => {
		const instruction: any = {};
		instruction.opcode = ShowHero.Opcode;
		instruction.arguments = [];

		engine.hero.visible = false;

		await execute(instruction);
		expect(engine.hero.visible).toBeTrue();
	});
});
