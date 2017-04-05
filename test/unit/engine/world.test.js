import World from '/engine/world';
import Point from '/util/point';
import Zone from '/engine/objects/zone';

describe('World', () =>  {
	it('knows the standard size of a world', () =>  {
		expect(World.HEIGHT).toBe(10);
		expect(World.WIDTH).toBe(10);
	});

	it('has methods to get and set zones at a specific place', () =>  {
		let world = new World();

		expect(world.getZone(0, 0)).toBe(null);
		expect(world.getZone(5, 5)).toBe(null);
		expect(world.getZone(9, 9)).toBe(null);
		expect(world.getZone(new Point(0, 0))).toBe(null);

		let zone = new Zone();
		world.data = {
			zones: [zone]
		};
		world.setZone(5, 5, 0);
		expect(world.getZone(5, 5)).toBe(zone);
	});

	it('returns null if asked for a zone outside the world\'s bounds', () =>  {
		let world = new World();
		expect(world.getZone(-1, -1)).toBe(null);
		expect(world.getZone(10, 10)).toBe(null);
	});

	it('throws an execption when you try to set a zone without setting game data first', () =>  {
		let world = new World();

		expect(() =>  {
			world.setZone(0, 0, 0);
		}).toThrow();
	});

	describe('locationOfZone', () =>  {
		it('it returns a point specify where the zone is', () =>  {
			let world = new World();
			let zone = new Zone();
			world.data = {
				zones: [zone]
			};
			world.setZone(5, 2, 0);

			let point = world.locationOfZone(zone);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it('returns null if the world does not contain the zone', () =>  {
			let world = new World();
			let zone = new Zone();
			world.data = {
				zones: [zone]
			};
			let point = world.locationOfZone(zone);
			expect(point).toBe(null);
		});
	});

	describe('locationOfZoneWithID', () =>  {
		it('returns the same as locationOfZone but takes an id instead of zone', () =>  {
			let world = new World();
			let zone = new Zone();
			world.data = {
				zones: [zone]
			};
			world.setZone(5, 2, 0);

			let point = world.locationOfZoneWithID(0);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it('returns the same as locationOfZone but takes an id instead of zone', () =>  {
			let world = new World();
			let zone = new Zone();
			world.data = {
				zones: [zone]
			};
			let point = world.locationOfZoneWithID(3);
			expect(point).toBe(null);
		});
	});
});
