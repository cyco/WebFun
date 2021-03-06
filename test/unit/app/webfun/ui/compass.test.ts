import Compass, { Direction } from "src/app/webfun/ui/compass";

describeComponent(Compass, () => {
	let subject: Compass;
	beforeEach(() => (subject = render(Compass) as any));
	afterEach(() => subject.remove());

	it("shows which adjacent zones can be accessed, by default all directions are inaccessible", () => {
		expect(subject.mask).toBe(Direction.None);
	});

	describe("activating is done by setting a css class on the svg", () => {
		it("can activate the left arrow", () => {
			subject.mask = Direction.West;
			expect((subject as any)._svg.classList).toContain("left");
		});

		it("can deactivate the left arrow", () => {
			subject.mask = Direction.West;
			subject.mask &= ~Direction.West;
			expect((subject as any)._svg.classList).not.toContain("left");
		});

		it("can activate the down arrow", () => {
			subject.mask = Direction.South;
			expect((subject as any)._svg.classList).toContain("down");
		});

		it("can deactivate the down arrow", () => {
			subject.mask = Direction.South;
			subject.mask &= ~Direction.South;
			expect((subject as any)._svg.classList).not.toContain("down");
		});

		it("can activate the right arrow", () => {
			subject.mask = Direction.East;
			expect((subject as any)._svg.classList).toContain("right");
		});

		it("can deactivate the right arrow", () => {
			subject.mask = Direction.East;
			subject.mask &= ~Direction.East;
			expect((subject as any)._svg.classList).not.toContain("right");
		});

		it("can activate the up arrow", () => {
			subject.mask = Direction.North;
			expect((subject as any)._svg.classList).toContain("up");
		});

		it("can deactivate the up arrow", () => {
			subject.mask = Direction.North;
			subject.mask &= ~Direction.North;
			expect((subject as any)._svg.classList).not.toContain("up");
		});
	});

	it("can show multiple states at once", () => {
		subject.mask = Direction.North | Direction.West;

		expect((subject as any)._svg.classList).toContain("up");
		expect((subject as any)._svg.classList).toContain("left");
	});
});
