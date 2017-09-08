import { Instruction } from "src/engine/objects";
import * as SpeakNPC from "src/engine/script/instructions/speak-npc";

describeInstruction("SpeakNPC", (execute, engine) => {
	it("shows a speech bubble next to an npc", () => {
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

		execute(instruction);

		expect(scene.text).toEqual("test text");
		expect(scene.location.x).toBe(0);
		expect(scene.location.y).toBe(1);
	});
});
