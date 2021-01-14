import WorldSizeWindow from "src/app/webfun/windows/world-size-window";
import { SettingsWindow } from "src/app/webfun/ui";

describeComponent(WorldSizeWindow, () => {
	let subject: any;
	beforeEach(() => (subject = render(WorldSizeWindow) as any));

	it("is a settings window", () => {
		expect(subject instanceof SettingsWindow).toBeTrue();
	});

	it("sets automatically sets up default attributes", () => {
		expect(subject.title).toBe("World Size");
		expect(subject.key).toBe("world-size");
		expect(subject.minLabel).toBe("Small");
		expect(subject.midLabel).toBe("Medium");
		expect(subject.maxLabel).toBe("Large");
	});
});
