import TouchInputManager from "src/app/input/touch-input-manager";
import { InputMask } from "src/engine/input";

describe("WebFun.App.Input.TouchInputManager", () => {
	let subject: TouchInputManager;
	let gameView: HTMLElement;
	let pad: any;
	let shoot: any;
	let drag: any;

	beforeEach(() => {
		gameView = {} as any;
		shoot = { pressed: false } as any;
		pad = { input: InputMask.None } as any;
		drag = { pressed: false } as any;

		subject = new TouchInputManager(gameView, pad, shoot, drag);
	});

	describe("when installed", () => {
		beforeEach(() => {
			subject.addListeners();
		});

		describe("and input is read without any changes on the controls", () => {
			let input: InputMask;
			beforeEach(() => {
				input = subject.readInput(0);
			});

			it("reports the default state as input", () => {
				expect(input).toBe(InputMask.None);
			});
		});

		describe("and the controls report some input state", () => {
			beforeEach(() => {
				pad.input = InputMask.Left | InputMask.Up | InputMask.Walk;
				shoot.pressed = true;
				drag.pressed = true;
			});

			describe("and input is read", () => {
				let input: InputMask;
				beforeEach(() => {
					input = subject.readInput(0);
				});

				it("merges the various inputs", () => {
					expect(input).toBe(
						InputMask.Left |
							InputMask.Up |
							InputMask.Walk |
							InputMask.Drag |
							InputMask.Left |
							InputMask.Up |
							InputMask.Attack
					);
				});
			});
		});

		afterEach(() => {
			subject.clear();
			subject.removeListeners();
		});
	});
});
