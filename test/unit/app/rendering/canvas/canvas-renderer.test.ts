import CanvasRenderer from "src/app/rendering/canvas/canvas-renderer";
import { Point } from "src/util";

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
			restore() {},
			fillText() {}
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

	it("has a method to draw text", () => {
		spyOn(context, "fillText");

		subject.renderText("A String!", new Point(5, 5));
		expect(context.fillText).toHaveBeenCalledWith("A String!", 5, 11.5);
	});

	it("determines support by querrying a canvas", () => {
		const mockedCanvas = { getContext: jasmine.createSpy() } as any;
		spyOn(document, "createElement").and.returnValue(mockedCanvas);

		mockedCanvas.getContext.and.returnValue(null);
		expect(CanvasRenderer.isSupported()).toBeFalse();
		mockedCanvas.getContext.and.returnValue({});
		expect(CanvasRenderer.isSupported()).toBeTrue();
	});

	it("passes some render functions to the context", () => {
		const mockedImage = ({} as any) as HTMLImageElement;
		spyOn(context, "drawImage");
		subject.renderImage(mockedImage, 5, 3);
		expect(context.drawImage).toHaveBeenCalledWith(mockedImage, 5, 3);

		subject.drawImage(mockedImage, 4, 2);
		expect(context.drawImage).toHaveBeenCalledWith(mockedImage, 4, 2);
	});

	it("stubs some methods to conform to the renderer interface", () => {
		expect(() => subject.redisplayTile(0, 0)).not.toThrow();
		expect(() => subject.redisplayRect(0, 0, 0, 0)).not.toThrow();
		expect(() => subject.redisplay()).not.toThrow();
	});
});
