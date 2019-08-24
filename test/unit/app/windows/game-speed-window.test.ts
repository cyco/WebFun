import GameSpeedWindow from "src/app/windows/game-speed-window";
import { SettingsWindow } from "src/app/ui";

describeComponent(GameSpeedWindow, () => {
	let subject: GameSpeedWindow;
	beforeEach(() => (subject = render(GameSpeedWindow) as any));

	it("is a settings window", () => {
		expect(subject instanceof SettingsWindow).toBeTrue();
	});

	it("sets automatically sets up default attributes", () => {
		expect(subject.title).toBe("Game Speed");
		expect((subject as any).key).toBe("speed");
		expect((subject as any).minLabel).toBe("Slow");
		expect((subject as any).maxLabel).toBe("Fast");
	});
});
