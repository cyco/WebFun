import { ParseExpectation, PrepareExpectations } from "src/debug/expectation";
import Worlds from "test/fixtures/worlds.txt";

xdescribe("WebFun.Acceptance.Gameplay.FindNextWorldToTest", () => {
	findWorldToTestNext();
});

function findWorldToTestNext() {
	const bestWorld = findBestWorld(PrepareExpectations(Worlds).sort().map(ParseExpectation));
	if (bestWorld) console.log("best world: ", bestWorld.seed, bestWorld.planet, bestWorld.size);
	else console.log("could not find a world to satisfy requirements");
}

function worldContains(world: any, z: any) {
	return (
		world.dagobah &&
		(world.dagobah.some((w: any) => w[0] === z) || world.world.some((w: any) => w[0] === z))
	);
}

function testWorld(world: any, [current, ...rest]: number[][]) {
	for (const candidate of current) {
		if (!worldContains(world, candidate)) continue;

		if (rest.length === 0) return true;
		if (testWorld(world, rest)) return true;
	}

	return false;
}

function findBestWorld(worlds: any) {
	// prettier-ignore
	const things = [[72,401]];

	const origCount = things.length;

	do {
		console.log("Trying to cover", things.length, "of", origCount, "symbols");
		for (const world of worlds) {
			if (testWorld(world, things)) return world;
		}
	} while ((things.pop(), things.length));

	return null;
}
