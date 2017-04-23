import GameController from "./game-controller";

export default () => {
	const gameController = new GameController();
	gameController.start();

	return;
	for (let seed = 23; seed < 101; seed++) {
		for (let size = 1; size <= 3; size++) {
			for (let planet = 1; planet <= 3; planet++) {
				console.log(`dumpWorld(0x${seed.toString(0x10)}, 0x${planet.toString(0x10)}, 0x${size.toString(0x10)});`);
			}
		}
	}
};
