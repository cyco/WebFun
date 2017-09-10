import StatisticsWindow from "src/app/windows/statistics-window";

describeComponent(StatisticsWindow, () => {
	let subject;
	beforeEach(() => subject = render(StatisticsWindow));

	it('renders serveral text boxes', () => {
		expect(subject.querySelector('input')).not.toBeNull();
	});
});
