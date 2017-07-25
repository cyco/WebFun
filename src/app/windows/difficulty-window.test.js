import DifficultyWindow from "./difficulty-window";
import { SettingsWindow } from "/app/ui/components";

describeComponent(DifficultyWindow, () => {
	let subject;
	beforeEach(() => subject = render(DifficultyWindow));

	it('is a settings window', () => {
		expect(subject instanceof SettingsWindow).toBeTrue();
	});

	it('sets automatically sets up default attributes', () => {
		expect(subject.getAttribute('title')).toBe('Difficulty');
		expect(subject.getAttribute('key')).toBe('difficulty');
		expect(subject.getAttribute('min-label')).toBe('Easy');
		expect(subject.getAttribute('max-label')).toBe('Difficult');
		expect(subject.getAttribute('steps')).toBe('3');
	});
});
