import AbstractRenderer from "src/engine/rendering/abstract-renderer";
import CanvasRenderer from "src/app/rendering/canvas/canvas-renderer";
import { dispatch } from "src/util";

describe("WebFun.App.Rendering.Canvas.Renderer", () => {
	let subject = null;
	let context, canvas;

	beforeEach(() => {
		context = {
			clearRect() {},
			drawImage() {},
			putImageData() {},
			save() {},
			fillRect() {},
			restore() {}
		};
		canvas = { getContext: () => context };
		subject = new CanvasRenderer(canvas);
	});

	it("is a canvas based renderer", () => {
		expect(subject).toBeInstanceOf(AbstractRenderer);
	});

	it("sets up the context for pixelated rendering", () => {
		expect(context.globalCompositeOperation).toBe("source-over");
		expect(context.webkitImageSmoothingEnabled).toBeFalse();
	});

	it("implements the clear method", () => {
		spyOn(context, "clearRect");

		canvas.width = 10;
		canvas.height = 20;

		subject.clear();
		expect(context.clearRect).toHaveBeenCalledWith(0, 0, 10, 20);
	});

	it("do nothing when clearTile is called", () => {
		expect(() => subject.clearTile()).not.toThrow();
	});

	describe("renderZoneTile", () => {
		it("builds images on first render", () => {
			let resolve;
			spyOn(context, "drawImage");
			spyOn(subject._imageFactory, "buildImage").and.returnValue(
				new Promise((r, reject) => (resolve = r))
			);

			const tile = { id: 5 };
			subject.renderZoneTile(tile, 1, 2);

			expect(context.drawImage).not.toHaveBeenCalled();
			expect(subject._imageFactory.buildImage).toHaveBeenCalled();

			resolve({});
		});

		it("only builds images once", () => {
			let resolve;
			spyOn(subject._imageFactory, "buildImage").and.returnValue(
				new Promise((r, reject) => (resolve = r))
			);

			const tile = { id: 6 };
			subject.renderZoneTile(tile, 1, 2);
			subject.renderZoneTile(tile, 1, 2);

			expect(subject._imageFactory.buildImage.calls.count()).toBe(1);

			resolve({});

			subject.renderZoneTile(tile, 1, 2);
			expect(subject._imageFactory.buildImage.calls.count()).toBe(1);
		});

		it("renders a tile only after the image has been built, potentially missing for several frames", async done => {
			const imageMock = { representation: "mocked-representation" };
			let resolve;
			const tile = { id: 9 };
			spyOn(subject._imageFactory, "buildImage").and.returnValue(
				new Promise((r, reject) => (resolve = r))
			);
			spyOn(context, "drawImage");

			subject.renderZoneTile(tile, 1, 2);
			expect(context.drawImage).not.toHaveBeenCalled();
			subject.renderZoneTile(tile, 1, 2);
			expect(context.drawImage).not.toHaveBeenCalled();

			resolve(imageMock);

			await dispatch(() => void 0);

			subject.renderZoneTile(tile, 1, 2);

			expect(context.drawImage).toHaveBeenCalledWith("mocked-representation", 32, 64);

			done();
		});
	});

	it("implements renderImageData", () => {
		spyOn(context, "putImageData");

		subject.renderImageData("image-rep", 1, 2);
		expect(context.putImageData).toHaveBeenCalledWith("image-rep", 1, 2);
	});

	it("implements fillBlackRect", () => {
		spyOn(context, "fillRect");

		subject.fillBlackRect(10, 12, 13, 14);
		expect(context.fillRect).toHaveBeenCalledWith(10, 12, 13, 14);
		expect(context.fillStyle).toBe("#000000");
	});

	it("has tile filling method used for debugging", () => {
		expect(subject).toHaveMethod("fillTile");
		expect(() => subject.fillTile()).not.toThrow();
	});
});
