import GameSpeedWindow from "./game-speed-window";
import { SettingsWindow } from "/app/ui/components";

describeComponent(GameSpeedWindow, () => {
	let subject;
	beforeEach(() => subject = render(GameSpeedWindow));

	it('is a settings window', () => {
		expect(subject instanceof GameSpeedWindow).toBeTrue();
	});

	it('sets automatically sets up default attributes', () => {
		expect(subject.getAttribute('title')).toBe('Game Speed');
		expect(subject.getAttribute('key')).toBe('speed');
		expect(subject.getAttribute('min-label')).toBe('Slow');
		expect(subject.getAttribute('max-label')).toBe('Fast');
	});
});
