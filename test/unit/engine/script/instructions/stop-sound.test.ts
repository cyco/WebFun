import StopSound from "src/engine/script/instructions/stop-sound";

describeInstruction("StopSound", (execute, engine) => {
	it("stops all sounds that are currently playing", async () => {
		const instruction: any = {};
		instruction.opcode = StopSound.Opcode;
		instruction.arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
