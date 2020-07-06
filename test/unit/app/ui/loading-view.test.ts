import LoadingView from "src/app/ui/loading-view";
import { SegmentedProgressBar } from "src/ui/components";
import { PaletteView } from "src/app/ui";
import { Size } from "src/util";
import { ColorPalette } from "src/engine";

describeComponent(LoadingView, () => {
	let subject: LoadingView;

	beforeEach(() => (subject = render(LoadingView) as any));
	afterEach(() => subject.remove());

	it("renders the game's setup image in a palette view once it becomes available", () => {
		const paletteView = subject.querySelector(PaletteView.tagName) as PaletteView;
		const mockedPalette = ColorPalette.FromBGR8(new Uint8Array());
		const mockedImage = new Uint8Array();

		expect(paletteView).not.toBeNull();
		expect(paletteView.size).toEqual(new Size(288, 288));

		subject.image = mockedImage;
		subject.palette = mockedPalette;

		expect(subject.image).toBe(paletteView.image);
		expect(subject.palette).toBe(paletteView.palette);
	});

	it("shows a progress bar", () => {
		expect(subject.querySelector(SegmentedProgressBar.tagName)).not.toBeNull();
	});

	describe("when the progress is changed", () => {
		beforeEach(() => (subject.progress = 0.5));

		it("updates the progress bar", () => {
			const bar = subject.querySelector(SegmentedProgressBar.tagName) as SegmentedProgressBar;
			expect(bar.value).toEqual(0.5);
			expect(subject.progress).toEqual(0.5);
		});
	});
});
