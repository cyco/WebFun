import SegmentedProgressBar from "src/ui/components/segmented-progress-bar";

describeComponent(SegmentedProgressBar, () => {
	let progressBar: SegmentedProgressBar;

	beforeEach(() => (progressBar = render(SegmentedProgressBar) as SegmentedProgressBar));

	it("is a class that displays a bar indicating the current progress of an operation", () => {
		expect(SegmentedProgressBar).toBeClass();
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
