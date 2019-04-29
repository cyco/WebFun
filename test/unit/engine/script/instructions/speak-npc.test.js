import { Instruction } from "src/engine/objects";
import SpeakNPC from "src/engine/script/instructions/speak-npc";
import * as Util from "src/util";

describeInstruction("SpeakNPC", (execute, engine) => {
	it("shows a speech bubble next to an npc", async done => {
		const mockedPoint = new Util.Point(0, 1);
		spyOn(engine, "speak");
		spyOn(Util, "Point").and.returnValue(mockedPoint);

		const instruction = new Instruction({});
		instruction._opcode = SpeakNPC.Opcode;
		instruction._arguments = [0, 1];
		instruction._additionalData = "test text";

		await execute(instruction);

		expect(engine.speak).toHaveBeenCalledWith("test text", mockedPoint);

		done();
	});
});
