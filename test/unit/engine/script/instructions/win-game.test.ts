import WinGame from "src/engine/script/instructions/win-game";

describeInstruction("WinGame", (execute, engine) => {
	it("ends the current story by winning", async () => {
		spyOn(engine.sceneManager, "pushScene");

		const instruction: any = {};
		instruction.opcode = WinGame.Opcode;
		instruction.arguments = [0, 1, 2, 3, 4];

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalled();
	});
});
