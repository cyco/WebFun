import { Instruction } from "src/engine/objects";
import SpeakNPC from "src/engine/script/instructions/speak-npc";

describeInstruction("SpeakNPC", (execute, engine) => {
	it("shows a speech bubble next to an npc", async (done) => {
		let scene = null;
		engine.sceneManager = {
			pushScene(s) {
				scene = s;
			}
		};

		let instruction = new Instruction({});
		instruction._opcode = SpeakNPC.Opcode;
		instruction._arguments = [0, 1];
		instruction._additionalData = "test text";

		await execute(instruction);

		expect(scene.text).toEqual("test text");

		done();
	});
});
