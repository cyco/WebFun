import Location, { Direction } from "/app/ui/components/location";

describeComponent(Location, () => {
	let subject;
	beforeAll(() => subject = render(Location));

	it("shows which adjacent zones can be accessed, by default all directions are inaccessible", () => {
		expect(subject.mask).toBe(Direction.None);
	});

	describe("activating is done by setting a css class on the svg", () => {
		it("can activate the left arrow", () => {
			subject.mask = Direction.West;
			expect(subject._svg.classList).toContain("left");
		});

		it("can deactivate the left arrow", () => {
			subject.mask ^= Direction.West;
			expect(subject._svg.classList).not.toContain("left");
		});

		it("can activate the down arrow", () => {
			subject.mask = Direction.South;
			expect(subject._svg.classList).toContain("down");
		});

		it("can deactivate the down arrow", () => {
			subject.mask ^= Direction.South;
			expect(subject._svg.classList).not.toContain("down");
		});

		it("can activate the right arrow", () => {
			subject.mask = Direction.East;
			expect(subject._svg.classList).toContain("right");
		});

		it("can deactivate the right arrow", () => {
			subject.mask ^= Direction.East;
			expect(subject._svg.classList).not.toContain("right");
		});

		it("can activate the up arrow", () => {
			subject.mask = Direction.North;
			expect(subject._svg.classList).toContain("up");
		});

		it("can deactivate the up arrow", () => {
			subject.mask ^= Direction.North;
			expect(subject._svg.classList).not.toContain("up");
		});
	});

	it("can show multiple states at once", () => {
		subject.mask = Direction.North | Direction.West;

		expect(subject._svg.classList).toContain("up");
		expect(subject._svg.classList).toContain("left");
	});
});
