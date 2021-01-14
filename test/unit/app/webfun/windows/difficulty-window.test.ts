import { SettingsWindow } from "src/app/webfun/ui";
import DifficultyWindow from "src/app/webfun/windows/difficulty-window";

describeComponent(DifficultyWindow, () => {
	let subject: any;
	beforeEach(() => (subject = render(DifficultyWindow) as any));

	it("is a settings window", () => {
		expect(subject instanceof SettingsWindow).toBeTrue();
	});

	it("sets automatically sets up default attributes", () => {
		expect(subject.title).toBe("Difficulty");
		expect(subject.key).toBe("difficulty");
		expect(subject.minLabel).toBe("Easy");
		expect(subject.midLabel).toBe("Medium");
		expect(subject.maxLabel).toBe("Hard");
	});
});
