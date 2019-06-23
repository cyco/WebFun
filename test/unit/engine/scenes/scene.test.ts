import Scene from "src/engine/scenes/scene";
import { Engine } from "src/engine";
import { Point } from "src/util";

describe("WebFun.Engine.Scenes.Scene", () => {
	let subject: Scene = null;

	beforeEach(() => (subject = new (Scene as any)()));

	it("is an abstract class representing a scene in the game", () => {
		expect(subject).toHaveMethod("willShow");
		expect(subject).toHaveMethod("didShow");
		expect(subject).toHaveMethod("willHide");
		expect(subject).toHaveMethod("didHide");
		expect(subject).toHaveMethod("isOpaque");
	});

	it("defines scenes as opaque by default to allow for mor efficient rendering", () => {
		expect(subject.isOpaque()).toBeTrue();
	});

	it("has a method for accessing the current camera's offset", () => {
		const fakeOffset = ({} as any) as Point;
		subject.engine = ({ camera: { offset: fakeOffset } } as any) as Engine;
		expect(subject.cameraOffset).toBe(fakeOffset);
	});
});
