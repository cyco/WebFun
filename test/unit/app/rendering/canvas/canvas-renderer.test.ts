import CanvasRenderer from "src/app/rendering/canvas/canvas-renderer";

describe("WebFun.App.Rendering.Canvas.Renderer", () => {
	let subject: CanvasRenderer = null;
	let context: any;
	let canvas: HTMLCanvasElement;

	beforeEach(() => {
		context = {
			clearRect() {},
			drawImage() {},
			putImageData() {},
			save() {},
			fillRect() {},
			restore() {}
		};
		canvas = { getContext: () => context } as any;
		subject = new CanvasRenderer(canvas);
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

	it("implements renderImageData", () => {
		spyOn(context, "putImageData");

		(subject as any).renderImageData("image-rep", 1, 2);
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
		expect(() => (subject as any).fillTile()).not.toThrow();
	});
});
