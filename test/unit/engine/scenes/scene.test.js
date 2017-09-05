import Scene from "src/engine/scenes/scene";

describe("Scene", () => {
	let subject = null;

	beforeEach(() => {
		subject = new Scene();
	});

	it("is an abstract class representing a scene in the game", () => {
		expect(subject).toHaveMethod("willShow");
		expect(subject).toHaveMethod("didShow");
		expect(subject).toHaveMethod("willHide");
		expect(subject).toHaveMethod("didHide");
		expect(subject).toHaveMethod("render");
		expect(subject).toHaveMethod("update");
		expect(subject).toHaveMethod("isOpaque");
	});

	it("doesn' enforce implementation of any methods", () => {
		expect(() => subject.willShow()).not.toThrow();
		expect(() => subject.didShow()).not.toThrow();
		expect(() => subject.willHide()).not.toThrow();
		expect(() => subject.didHide()).not.toThrow();
		expect(() => subject.render()).not.toThrow();
		expect(() => subject.update()).not.toThrow();
		expect(() => subject.isOpaque()).not.toThrow();
	});

	it("defines scenes as opaque by default to allow for mor efficient rendering", () => {
		expect(subject.isOpaque()).toBeTrue();
	});

	it("has a method for accessing the current camera's offset", () => {
		const fakeOffset = {};
		subject.engine = { sceneManager: { _stack: [ { camera: { offset: fakeOffset } } ] } };
		expect(subject.cameraOffset).toBe(fakeOffset);
	});
});
