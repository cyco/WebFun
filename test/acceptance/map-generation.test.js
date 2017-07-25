import loadMapFixtures from "test-helpers/map-fixture-parsing";
import MapGenerator from "src/engine/generation/map-generator";

const getSizeName = (size) => {
	if (size === 1) return "Small";
	if (size === 2) return "Medium";
	if (size === 3) return "Large";

	return "Invalid";
};

const getPlanetName = (p) => {
	if (p === 1) return "Tatooine";
	if (p === 2) return "Hoth";
	if (p === 3) return "Endor";
	return "Invalid";
};

xdescribe('Map Generation', function () {
	console.log('Map Generation');
	let orderMaps = loadMapFixtures('order_maps.txt');
	let typeMaps = loadMapFixtures('type_maps.txt');

	for (let i = 0; i < typeMaps.length; i++) {
		window.logging = false;

		let seed = typeMaps[i].seed;
		let size = typeMaps[i].size;
		let planet = typeMaps[i].planet;

		it('Map 0x' + seed.toString(0x10) + " " + getPlanetName(planet) + " " + getSizeName(size),
			(function (typeSample, orderSample) {
				return () => {
					console.log('test map');
					let seed = typeSample.seed;
					let planet = typeSample.planet;
					let size = typeSample.size;
					let types = typeSample.data;
					let order = orderSample.data;
					let generator = new MapGenerator();
					let stuff = generator.generate(seed, size);

					expect(Array.from(stuff)).toEqual(types);
					expect(Array.from(generator.orderMap)).toEqual(order);
				};
			})(typeMaps[i], orderMaps[i]));
	}
});
