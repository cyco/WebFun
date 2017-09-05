import CanvasRenderer from "src/engine/rendering/canvas/canvas-renderer";
import AbstractRenderer from "src/engine/rendering/abstract-renderer";

describe("CanvasRenderer", () => {
	let subject = null;
	let context, canvas;

	beforeEach(() => {
		context = {
			clearRect() {
			},
			drawImage() {
			},
			putImageData() {
			},
			save() {
			},
			fillRect() {
			},
			restore() {
			}
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

	it("implements renderTile", () => {
		spyOn(context, "drawImage");

		subject.renderTile(null, 0, 0);
		expect(context.drawImage).not.toHaveBeenCalled();

		const tile = { image: { representation: "image-rep" } };
		subject.renderTile(tile, 1, 2);
		expect(context.drawImage).toHaveBeenCalledWith("image-rep", 32, 64);
	});

	it("implements renderImage", () => {
		spyOn(context, "drawImage");

		const tile = { representation: "image-rep" };
		subject.renderImage(tile, 1, 2);
		expect(context.drawImage).toHaveBeenCalledWith("image-rep", 1, 2);
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
