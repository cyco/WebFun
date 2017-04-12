import World from '/engine/world';
import Point from '/util/point';
import Zone from '/engine/objects/zone';

describe('World', () => {
	let subject = null;
	let zone = null;
	beforeEach(() => {
		subject = new World();
		zone = new Zone();
		subject.data = {
			zones: [zone]
		};
	});

	it('knows the standard size of a world', () => {
		expect(World.HEIGHT).toBe(10);
		expect(World.WIDTH).toBe(10);
	});

	it('has methods to get and set zones at a specific place', () => {
		expect(subject.getZone(0, 0)).toBe(null);
		expect(subject.getZone(5, 5)).toBe(null);
		expect(subject.getZone(9, 9)).toBe(null);
		expect(subject.getZone(new Point(0, 0))).toBe(null);

		subject.setZone(5, 5, 0);
		expect(subject.getZone(5, 5)).toBe(zone);
	});

	it('returns null if asked for a zone outside the world\'s bounds', () => {
		expect(subject.getZone(-1, -1)).toBe(null);
		expect(subject.getZone(10, 10)).toBe(null);
	});

	describe('locationOfZone', () => {
		it('it returns a point specify where the zone is', () => {
			subject.setZone(5, 2, 0);

			let point = subject.locationOfZone(zone);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it('returns null if the world does not contain the zone', () => {
			let point = subject.locationOfZone(zone);
			expect(point).toBe(null);
		});
	});

	describe('locationOfZoneWithID', () => {
		it('returns the same as locationOfZone but takes an id instead of zone', () => {
			subject.setZone(5, 2, 0);

			let point = subject.locationOfZoneWithID(0);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it('returns the same as locationOfZone but takes an id instead of zone', () => {
			let point = subject.locationOfZoneWithID(3);
			expect(point).toBe(null);
		});
	});
});
