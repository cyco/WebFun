import "@babel/polyfill";
import FS from "fs";
import Path from "path";
import "../test/helpers/polyfill";
import "src/extension";
import {
	CompareWorldItems,
	ComparisonResult,
	ParseExpectation,
	PrepareExpectations
} from "src/debug/expectation";
import { GameData, Story, GameType, GameTypeYoda } from "src/engine";
import { Planet, WorldSize } from "../src/engine/types";
import { InputStream, srand, rand, randmod } from "src/util";
import ReadFile from "src/engine/file-format";

const Exit = {
	Normal: 0,
	Usage: 1,
	Error: 2
};

const exit = (code = Exit.Normal) => process.exit(code);

const help = (node, self) => {
	process.stdout.write(`usage: ${node} ${self} [options] seed planet size\n`);
	process.stdout.write(`\tseed    0 - 0xFFFF (65535)\n`);
	process.stdout.write(`\tplanet  1 (Tatooine), 2 (Hoth), 3 (Endor)\n`);
	process.stdout.write(`\tsize    1 - 3\n`);

	process.stdout.write("\n");
	process.stdout.write("options:\n");
	process.stdout.write(`\t-c       compare with original\n`);
	process.stdout.write(`\t-a       generate all worlds in expection file\n`);
	process.stdout.write(`\t-p       print result as json object\n`);
	process.stdout.write(`\t-d path  game file (default: ./yoda.data)\n`);
	process.stdout.write(`\t-e path  expectation file (default: ./worlds.txt)\n`);
};

const helpAndExit = (error, node, self) => {
	process.stdout.write(`${error}\n`);
	help(node, self);
	exit(Exit.Usage);
};

const parseIntegerArgument = (input, name) => {
	if (input === undefined) throw `Required argument ${name} missing!`;

	input = input.toLowerCase();
	let base = 10;
	if (input.startsWith("0x")) {
		input = input.substr(2);
		base = 0x10;
	}

	const result = parseInt(input, base);
	if (isNaN(result)) throw `Argument ${name} is not a number!`;
	return result;
};

const parseArguments = args => {
	const options = {
		d: "assets/game-data/yoda.data",
		e: "worlds.txt",
		v: false,
		c: false,
		a: false,
		p: false,

		r: false
	};
	const optionNames = Object.keys(options);
	const flagNames = optionNames.filter(o => typeof options[o] === "boolean");

	const nonOptionArguments = [];

	while (args.length) {
		const arg = args.shift();

		const isOption = arg.startsWith("-");
		const optionName = isOption && arg.substr(1);
		const isFlag = flagNames.contains(optionName);

		if (isOption && !optionNames.contains(optionName)) throw `Invalid option ${optionName} specified!`;

		if (isFlag) {
			options[optionName] = true;
			continue;
		}

		if (isOption && !args.length) throw `Invalid number of arguments specified!`;

		if (isOption) {
			options[optionName] = args.shift();
			continue;
		}

		nonOptionArguments.push(arg);
	}

	let [seed, planet, size] = nonOptionArguments;

	return {
		seed,
		planet,
		size,
		options
	};
};

const readArguments = (node, self, ...args) => {
	try {
		let { options, seed, planet, size } = parseArguments(args);

		if (!options.a) {
			seed = parseIntegerArgument(seed, "seed");
			planet = parseIntegerArgument(planet, "planet");
			size = parseIntegerArgument(size, "size");

			if (seed < 0 || seed > 0xffff) helpAndExit(`Seed is not in range 0 - 0xFFFF!`, node, self);
			if (planet < 1 || planet > 3) helpAndExit(`Planet is not in range 1 - 3!`, node, self);
			if (size < 0 || size > 3) helpAndExit(`Size is not in range 0 - 0xFFFF!`, node, self);
		}

		return {
			options,
			seed,
			planet: Planet.fromNumber(planet),
			size: WorldSize.fromNumber(size)
		};
	} catch (e) {
		helpAndExit(e, node, self);
	}

	return null;
};

const printResult = story => {
	const object = {
		seed: story.seed,
		planet: story.planet.rawValue,
		size: story.size.rawValue,
		reseeded: story._reseeded
	};

	object.world = {
		zoneIDs: story.world.map(i => (i.zone ? i.zone.id : -1)),
		zoneTypes: story.world.map(i => (i.zoneType ? i.zoneType.rawValue : -1)),
		requiredItemIDs: story.world.map(i => (i.requiredItem ? i.requiredItem.id : -1)),
		additionalRequiredItemIDs: story.world.map(i =>
			i.additionalRequiredItem ? i.additionalRequiredItem.id : -1
		),
		findItemIDs: story.world.map(i => (i.findItem ? i.findItem.id : -1)),
		npcIDs: story.world.map(i => (i.npc ? i.npc.id : -1))
	};
	/*
  	dagobah.unknowns1 = data.dagobah.map(z => z.unknown[0]);
  	dagobah.unknowns2 = data.dagobah.map(z => z.unknown[1]);
  	dagobah.unknowns3 = data.dagobah.map(z => z.unknown[2]);
  	dagobah.unknowns4 = data.dagobah.map(z => z.unknown[3]);
	*/

	object.dagobah = {
		zoneIDs: story.dagobah._items.filter((_, i) => [].contains(i)).map(i => (i.zone ? i.zone.id : -1)),
		zoneTypes: story.dagobah._items
			.filter((_, i) => [44, 45, 54, 55].contains(i))
			.map(i => (i.zoneType ? i.zoneType.rawValue : -1)),
		requiredItemIDs: story.dagobah._items
			.filter((_, i) => [44, 45, 54, 55].contains(i))
			.map(i => (i.requiredItem ? i.requiredItem.id : -1)),
		additionalRequiredItemIDs: story.dagobah._items
			.filter((_, i) => [44, 45, 54, 55].contains(i))
			.map(i => (i.additionalRequiredItem ? i.additionalRequiredItem.id : -1)),
		findItemIDs: story.dagobah._items
			.filter((_, i) => [44, 45, 54, 55].contains(i))
			.map(i => (i.findItem ? i.findItem.id : -1)),
		npcIDs: story.dagobah._items
			.filter((_, i) => [44, 45, 54, 55].contains(i))
			.map(i => (i.npc ? i.npc.id : -1))
	};
	/*
  	dagobah.unknowns1 = data.dagobah.map(z => z.unknown[0]);
  	dagobah.unknowns2 = data.dagobah.map(z => z.unknown[1]);
  	dagobah.unknowns3 = data.dagobah.map(z => z.unknown[2]);
  	dagobah.unknowns4 = data.dagobah.map(z => z.unknown[3]);
	*/

	console.log(JSON.stringify(object));
};

let rawData = null;
const readGameData = path => {
	const fullPath = Path.resolve(path);
	if (!FS.existsSync(path)) {
		throw `Game file ${fullPath} does not exist`;
	}

	try {
		if (!rawData) {
			const buffer = FS.readFileSync(fullPath);
			const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
			const stream = new InputStream(arrayBuffer);
			rawData = ReadFile(stream, GameTypeYoda);
		}

		return new GameData(rawData);
	} catch (e) {
		throw e;
		throw `Game file ${fullPath} could not be parsed!`;
	}
};

const readExpectations = path => {
	const fullPath = Path.resolve(path);
	if (!FS.existsSync(fullPath)) throw `Expectation file ${fullPath} does not exist!`;

	const fileContents = FS.readFileSync(fullPath, "utf8");
	return PrepareExpectations(fileContents).map(ParseExpectation);
};

const findExpectation = (expectations, seed, planet, size) =>
	expectations.find(e => e.seed === seed && e.planet === planet && e.size === size);
const compareItem = (actual, expected) => {
	const result = CompareWorldItems(actual, expected);
	if (result !== ComparisonResult.Different) return;

	if (actual.zoneID !== expected.zoneID)
		throw `Difference in zone ids detected! ${actual.zoneID} !== ${expected.zoneID}`;
	if (actual.zoneType !== expected.zoneType)
		throw `Difference in zone types detected! ${actual.zoneType} !== ${expected.zoneType}`;
	throw `Difference detected`;
};

const compare = (story, expectation) => {
	if (expectation.world === null && !story._reseeded) throw `Expected reseed!`;
	else if (expectation.world === null) return;

	/* main world */
	try {
		for (let i = 0; i < 100; i++) {
			compareItem(story.world.index(i), expectation.world[i]);
		}
	} catch (e) {
		throw `World: ${e}`;
	}

	/* dagobah */
	try {
		compareItem(story.dagobah.at(4, 4), expectation.dagobah[0]);
		compareItem(story.dagobah.at(5, 4), expectation.dagobah[1]);
		compareItem(story.dagobah.at(4, 5), expectation.dagobah[2]);
		compareItem(story.dagobah.at(5, 5), expectation.dagobah[3]);
	} catch (e) {
		throw `Dagobah: ${e}`;
	}
};

const main = (...args) => {
	let { options, seed, planet, size } = readArguments(...args);

	try {
		if (options.r) {
			srand(10);
			for (let i = 0; i < 1000; i++) {
				const gameData = readGameData(options.d);
				let seed = rand();
				let planet = Planet.fromNumber(1 + randmod(3));
				let size = WorldSize.fromNumber(1 + randmod(3));
				const story = new Story(seed, planet, size);
				story.generateWorld({ data: gameData });
				process.stdout.write(
					`[DONE]   0x${story.seed.toString(0x10)} ${story.planet.name} ${story.size.name}\n`
				);
			}
			return;
		}

		if (!options.a) {
			const gameData = readGameData(options.d);
			const story = new Story(seed, planet, size);

			try {
				story.generateWorld({ data: gameData });
			} catch (e) {
				throw `Unexpected failure in world generation. ${e}`;
			}

			if (options.p) {
				printResult(story);
			}

			if (options.c) {
				const expectations = readExpectations(options.e);
				const expectation = findExpectation(expectations, seed, planet, size);
				if (!expectation)
					throw `No sample found for world 0x${seed.toString(0x10)} 0x${planet.toString(
						0x10
					)} 0x${size.toString(0x10)}!`;

				compare(story, expectation);
			}
		} else {
			let tested = 0;
			let failed = 0;
			const expectations = readExpectations(options.e);
			expectations.forEach(e => {
				tested++;
				const { seed, planet, size } = e;
				const story = new Story(seed, planet, size);
				story.generateWorld({ data: readGameData(options.d) });

				try {
					compare(story, e);
					process.stdout.write(
						`[OK]   0x${seed.toString(0x10)} 0x${planet.toString(0x10)} 0x${size.toString(
							0x10
						)}\n`
					);
				} catch (err) {
					process.stdout.write(
						`[FAIL] 0x${seed.toString(0x10)} 0x${planet.toString(0x10)} 0x${size.toString(
							0x10
						)}\n`
					);
					failed++;
				}
			});

			process.stdout.write(
				`${tested - failed} of ${tested} world combinations were generated correctly!\n`
			);
		}
	} catch (error) {
		process.stderr.write(`${error}\n`);
		exit(Exit.Error);
	}
};

main(...process.argv);
