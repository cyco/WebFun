import TileSheet from "src/app/rendering/canvas-tilesheet/tile-sheet";

describe("WebFun.App.Rendering.CanvasTilesheet.TileSheet", () => {
	let subject;
	beforeEach(() => (subject = new TileSheet(12)));

	it("allocates a canvas with enough space to house all tiles", () => {
		const canvas = subject.sheetImage;
		expect(canvas.width).toBe(12 * 32);
		expect(canvas.height).toBe(32);
	});

	it("can determine the rectangle used by a specific entry", () => {
		{
			let { minX, minY, maxX, maxY } = subject.rectangleForEntry(0);
			expect(minX).toBe(0);
			expect(minY).toBe(0);
			expect(maxX).toBe(32);
			expect(maxY).toBe(32);
		}

		{
			let { minX, minY, maxX, maxY } = subject.rectangleForEntry(2);
			expect(minX).toBe(64);
			expect(minY).toBe(0);
			expect(maxX).toBe(96);
			expect(maxY).toBe(32);
		}
	});

	describe("when an item is added", () => {
		let entry1, subject;
		beforeEach(() => {
			subject = new TileSheet(2);
			entry1 = subject.add(new Uint8Array(32 * 32));
		});

		it("uses the first available region", () => {
			expect(entry1.rectangle.minX).toBe(0);
			expect(entry1.rectangle.minY).toBe(0);
			expect(entry1.rectangle.maxX).toBe(32);
			expect(entry1.rectangle.maxY).toBe(32);
		});

		describe("and another entry is added", () => {
			let entry2;
			beforeEach(() => (entry2 = subject.add(new Uint8Array(32 * 32))));

			it("uses a allocates a different region", () => {
				expect(entry2.rectangle.minX).toBe(32);
				expect(entry2.rectangle.minY).toBe(0);
				expect(entry2.rectangle.maxX).toBe(64);
				expect(entry2.rectangle.maxY).toBe(32);
			});

			it("throws an error if no space is available to add another entry", () => {
				expect(() => subject.add(new Uint8Array(32 * 32))).toThrow();
			});

			describe("and an entry is removed", () => {
				beforeEach(() => subject.remove(entry1));

				it("allows for an new entry to be allocated and reuses the cleared space", () => {
					const entry3 = subject.add(new Uint8Array(32 * 32));
					expect(entry3.rectangle.minX).toBe(0);
					expect(entry3.rectangle.minY).toBe(0);
					expect(entry3.rectangle.maxX).toBe(32);
					expect(entry3.rectangle.maxY).toBe(32);
				});

				it("does not throw an error if an unknown entry is to be removed", () => {
					expect(() => subject.remove(entry1)).not.toThrow();
				});
			});
		});
	});
});
