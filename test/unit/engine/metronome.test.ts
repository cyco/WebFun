import Metronome from "src/engine/metronome";

describe("WebFun.Engine.Metronome", () => {
	let metronome: Metronome;
	beforeEach(() => {
		metronome = new Metronome();
	});

	it("is a class that manages update and render cycles", () => {
		expect(Metronome).toBeAClass();

		expect(metronome).toHaveMethod("start");
		expect(metronome).toHaveMethod("stop");
	});

	it("uses requestAnimationFrame to allow for smooth rendering", () => {
		spyOn(window, "requestAnimationFrame").and.returnValue(1);

		metronome.start();

		expect(window.requestAnimationFrame).toHaveBeenCalled();
	});

	it("properly cancels animation frame requests when stopped", () => {
		spyOn(window, "requestAnimationFrame").and.returnValue(1);
		spyOn(window, "cancelAnimationFrame");

		metronome.start();
		metronome.stop();

		expect(window.cancelAnimationFrame).toHaveBeenCalled();
	});

	it("can be stopped multiple times", () => {
		expect(() => metronome.stop()).not.toThrow();
	});
});
