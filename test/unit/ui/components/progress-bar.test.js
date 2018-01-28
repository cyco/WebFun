import ProgressBar from "src/ui/components/progress-bar";

describeComponent(ProgressBar, () => {
	let progressBar;

	beforeEach(() => (progressBar = render(ProgressBar)));

	it("is a class that displays a bar indicating the current progress of an operation", () => {
		expect(ProgressBar).toBeClass();
	});

	it("shows the progress in the form of blue segments", () => {
		expect(progressBar.querySelectorAll("div").length).toBe(0);
		expect(progressBar.value).toBe(0);

		progressBar.value = 1;
		expect(progressBar.querySelectorAll("div").length).toBe(24);
		expect(progressBar.value).toBe(1);

		progressBar.value = 0;
		expect(progressBar.querySelectorAll("div").length).toBe(0);
		expect(progressBar.value).toBe(0);
	});
});
