import astar from "src/util/a-star";
import { Point, Rectangle, Size } from "src/util";
import { floor } from "src/std/math";

const FieldDescriptions = `
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  a         │  │  b     ••••│  │  a         │  │     a      │
│            │  │        •   │  │            │  │            │
│            │  │    ••      │  │            │  │    •••     │
│            │  │    • ••••• │  │     •••• ••│  │ •••   ••   │
│            │  │    •       │  │    •    •  │  │            │
│       b    │  │    •  a    │  │    •  b    │  │     b      │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
`;

describe("WebFun.Util.astar", () => {
	let fields: Field[];
	beforeAll(() => {
		fields = parseFields(FieldDescriptions);
	});

	it("finds a path from start to finish on an empty field", () => {
		expect(applyAstar(fields[0]).map(p => [p.x, p.y])).toEqual([
			[3, 1],
			[3, 2],
			[3, 3],
			[3, 4],
			[3, 5],
			[3, 6],
			[4, 6],
			[5, 6],
			[6, 6],
			[7, 6],
			[8, 6]
		]);
	});

	it("finds a path from start to end on a field with walls", () => {
		expect(applyAstar(fields[1]).map(p => [p.x, p.y])).toEqual([
			[8, 6],
			[8, 5],
			[9, 5],
			[10, 5],
			[11, 5],
			[12, 5],
			[12, 4],
			[12, 3],
			[11, 3],
			[10, 3],
			[9, 3],
			[8, 3],
			[8, 2],
			[8, 1],
			[7, 1],
			[6, 1],
			[5, 1],
			[4, 1],
			[3, 1]
		]);
	});

	it("returns null if no path can be found", () => {
		expect(applyAstar(fields[2])).toBeNull();
	});

	it("actually chooses the shortest path", () => {
		expect(applyAstar(fields[3]).map(p => [p.x, p.y])).toEqual([
			[6, 1],
			[6, 2],
			[7, 2],
			[8, 2],
			[8, 3],
			[9, 3],
			[10, 3],
			[10, 4],
			[10, 5],
			[10, 6],
			[9, 6],
			[8, 6],
			[7, 6],
			[6, 6]
		]);
	});

	/* Debug function to print map and a path through it
	function printPath(path: Point[], field: Field): void {
		const desc = field.desc.map(l => l.slice());
		if (path) path.forEach(p => (desc[p.y][p.x] = "."));

		desc[field.start.y][field.start.x] = "a";
		desc[field.end.y][field.end.x] = "b";

		console.log("\n" + desc.map(l => l.join("")).join("\n") + "\n");
	}
	//*/

	function applyAstar(field: Field): Point[] {
		const p = pointFromIndex.bind(null, field);
		const i = indexFromPoint.bind(null, field);

		const { start, end } = field;
		const bounds = field.bounds;
		const result = astar(
			i(start),
			i(end),
			node =>
				[
					p(node).byAdding(-1, 0),
					p(node).byAdding(1, 0),
					p(node).byAdding(0, -1),
					p(node).byAdding(0, 1)
				]
					.filter(node => bounds.contains(node))
					.map(i)
					.filter((n: number) => !field.walls[n]),
			(p1, p2) => p(p1).manhattanDistanceTo(p(p2)),
			p1 => p(p1).manhattanDistanceTo(end)
		);
		return result ? result.map(p) : result;
	}

	const Start = "┌",
		End = "┐";

	type Field = {
		bounds: Rectangle;
		start: Point;
		end: Point;

		desc: string[][];
		walls: boolean[];
	};

	function indexFromPoint(field: Field, point: Point) {
		return point.x + point.y * field.bounds.size.width;
	}

	function pointFromIndex(field: Field, n: number) {
		return new Point(n % field.bounds.size.width, floor(n / field.bounds.size.width));
	}

	function parseFields(visualField: string): Field[] {
		const chars = visualField
			.split("\n")
			.slice(1, -1)
			.map(line => line.split(""));

		const fields: Field[] = [];

		findStart: for (let f1 = 0; f1 < chars[0].length; f1++) {
			if (chars[0][f1] !== Start) {
				continue;
			}

			for (let f2 = f1 + 1; f2 < chars[0].length; f2++) {
				if (chars[0][f2] !== End) {
					continue;
				}

				let start: Point, end: Point;
				const desc = chars.map(l => l.slice(f1, f2 + 1));
				const walls = desc
					.map((l, y) =>
						l.map((c, x) => {
							if (c === "a") start = new Point(x, y);
							if (c === "b") end = new Point(x, y);

							return !(c === "a" || c === "b" || c === " ");
						})
					)
					.flatten();

				fields.push({
					bounds: new Rectangle(new Point(0, 0), new Size(desc[0].length, desc.length)),
					start,
					end,
					desc,
					walls
				});

				continue findStart;
			}
		}

		return fields;
	}
});
