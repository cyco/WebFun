import Health from "src/app/ui/health";

describeComponent(Health, () => {
	let subject;

	beforeEach(() => (subject = render(Health)));
	afterEach(() => subject.remove());

	it("displays the hero's health in a circle", () => {
		expect(subject.querySelector("svg")).not.toBe(null);
	});

	it("starts off with full health", () => {
		expect(subject.health).toBe(300);
		expect(subject.lives).toBe(3);
		expect(subject.damage).toBe(0);
	});
});
