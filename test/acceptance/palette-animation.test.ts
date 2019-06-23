import "test/helpers/declarations.ts";
import "src/extension";
import { drawImage } from "src/app/rendering";
import { ColorPalette, PaletteAnimation } from "src/engine/rendering";
import { Size } from "src/util";

describe("WebFun.Acceptance.Palette Animation", () => {
	const sampleImage = Uint8Array.from({ length: 0x100 }).map((_, i) => i);
	const fixtureImages = {
		0: buildFixtureUrl("palette_0.png"),
		1: buildFixtureUrl("palette_1.png"),
		2: buildFixtureUrl("palette_2.png"),
		145: buildFixtureUrl("palette_145.png")
	};
	let paletteData: ColorPalette;
	let animator: PaletteAnimation;

	beforeAll(async done => {
		paletteData = ColorPalette.FromBGR8Buffer(await getFixtureData("yoda.pal"));

		done();
	});

	beforeEach(() => (animator = new PaletteAnimation(paletteData)));

	it("renders the initial image correctly", async done => {
		animateXSteps(0);
		await assertCurrentImageIsEqualTo(fixtureImages[0]);
		done();
	});

	it("renders the image correctly after 1 animation steps", async done => {
		animateXSteps(1);
		await assertCurrentImageIsEqualTo(fixtureImages[1]);
		done();
	});

	it("renders the image correctly after 2 animation steps", async done => {
		animateXSteps(2);
		await assertCurrentImageIsEqualTo(fixtureImages[2]);
		done();
	});

	it("renders the image correctly after 145 animation steps", async done => {
		animateXSteps(145);
		await assertCurrentImageIsEqualTo(fixtureImages[145]);
		done();
	});

	it("arrives at the original state after 180 steps", async done => {
		animateXSteps(180);
		await assertCurrentImageIsEqualTo(fixtureImages[0]);
		done();
	});

	it("Can be reset to its original state", async done => {
		animateXSteps(145);
		animator.reset();
		await assertCurrentImageIsEqualTo(fixtureImages[0]);
		done();
	});

	function animateXSteps(steps: number) {
		while (steps--) {
			animator.step();
		}
	}

	async function assertCurrentImageIsEqualTo(src: string) {
		const actualImage = drawImage(sampleImage, new Size(16, 16), animator.current);
		return new Promise(resolve => {
			const expectedImage = new Image();
			expectedImage.onerror = expectedImage.onload = () => {
				const equal = compareImage(actualImage, expectedImage.toImageData());
				expect(equal).toBeTruthy();
				resolve();
			};
			expectedImage.src = src;
		});
	}

	async function compareImage(i1: ImageData, i2: ImageData): Promise<boolean> {
		return i1.data.every((v, i) => v === i2.data[i]);
	}
});
