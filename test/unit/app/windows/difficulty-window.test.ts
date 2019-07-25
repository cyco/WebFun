import { SettingsWindow } from "src/app/ui";
import DifficultyWindow from "src/app/windows/difficulty-window";

describeComponent(DifficultyWindow, () => {
	let subject: DifficultyWindow;
	beforeEach(() => (subject = render(DifficultyWindow) as any));

	it("is a settings window", () => {
		expect(subject instanceof SettingsWindow).toBeTrue();
	});

	it("sets automatically sets up default attributes", () => {
		expect(subject.title).toBe("Difficulty");
		expect((subject as any).key).toBe("difficulty");
		expect((subject as any).minLabel).toBe("Easy");
		expect((subject as any).midLabel).toBe("Medium");
		expect((subject as any).maxLabel).toBe("Hard");
	});
});
