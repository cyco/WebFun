import GameSpeedWindow from "src/app/windows/game-speed-window";

describeComponent(GameSpeedWindow, () => {
	let subject;
	beforeEach(() => (subject = render(GameSpeedWindow)));

	it("is a settings window", () => {
		expect(subject instanceof GameSpeedWindow).toBeTrue();
	});

	it("sets automatically sets up default attributes", () => {
		expect(subject.title).toBe("Game Speed");
		expect(subject.key).toBe("speed");
		expect(subject.minLabel).toBe("Slow");
		expect(subject.maxLabel).toBe("Fast");
	});
});
