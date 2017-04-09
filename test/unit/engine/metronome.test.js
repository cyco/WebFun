import * as Std from '/std';
import Metronome from '/engine/metronome';

describe("Metronome", () => {
	let metronome;
	beforeEach(() => {
		metronome = new Metronome();
	});

	it('is a class that manages update and render cycles', () => {
		expect(Metronome).toBeAClass();

		expect(metronome).toHaveMethod('start');
		expect(metronome).toHaveMethod('stop');
	});

	it('uses requestAnimationFrame to allow for smooth rendering', () => {
		spyOn(Std, 'requestAnimationFrame').and.returnValue(1);
		
		metronome.start();
		
		expect(Std.requestAnimationFrame).toHaveBeenCalled();
	});

	it('properly cancels animation frame requests when stopped', () => {
		spyOn(Std, 'requestAnimationFrame').and.returnValue(1);
		spyOn(Std, 'cancelAnimationFrame');

		metronome.start();
		metronome.stop();

		expect(Std.cancelAnimationFrame).toHaveBeenCalled();
	});
});
