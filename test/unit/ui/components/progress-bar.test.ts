import ProgressBar from "src/ui/components/progress-bar";

describeComponent(ProgressBar, () => {
	let subject: ProgressBar;
	beforeEach(() => (subject = render(ProgressBar) as ProgressBar));

	it("displays bar representing a value between 0 and 1", () => {
		subject.value = 0;
		const child = subject.firstElementChild as HTMLElement;
		expect(child.style.width).toBe("0%");

		subject.value = 0.1;
		expect(child.style.width).toBe("10%");

		subject.value = 0.5;
		expect(child.style.width).toBe("50%");

		subject.value = 1;
		expect(child.style.width).toBe("100%");
		expect(subject.value).toBe(1);
	});
});
