import SpeakNPC from "src/engine/script/instructions/speak-npc";
import * as Util from "src/util";

describeInstruction("SpeakNPC", (execute, engine) => {
	it("shows a speech bubble next to an npc", async () => {
		const mockedPoint = new Util.Point(0, 1);
		spyOn(engine, "speak");
		spyOn(Util, "Point").and.returnValue(mockedPoint);

		const instruction: any = {};
		instruction.opcode = SpeakNPC.Opcode;
		instruction.arguments = [0, 1];
		instruction.text = "test text";

		await execute(instruction);

		expect(engine.speak).toHaveBeenCalledWith("test text", mockedPoint);
	});
});
