import "./test/helpers/polyfill";
import "/extension";
import { ParseExpectation, PrepareExpectations } from "src/debug/expectation";
import Path from "path";
import FS from "fs";

const Exit = {
	Normal: 0,
	Usage: 1,
	Error: 2
};

const exit = (code = Exit.Normal) => process.exit(code);

const helpAndExit = (error) => {
	process.stdout.write(`${error}\n`);
	exit(Exit.Usage);
};

const parseArguments = (args) => {
	const options = {
		e: "world.txt",
		p: false
	};
	const optionNames = Object.keys(options);
	const flagNames = optionNames.filter((o) => typeof options[o] === "boolean");
	Object.seal(options);

	const nonOptionArguments = [];

	while (args.length) {
		const arg = args.shift();

		const isOption = arg.startsWith("-");
		const optionName = isOption && arg.substr(1);
		const isFlag = flagNames.contains(optionName);

		if (isOption && !optionNames.contains(optionName))
			throw `Invalid option ${optionName} specified!`;

		if (isFlag) {
			options[optionName] = true;
			continue;
		}

		if (isOption && !args.length)
			throw `Invalid number of arguments specified!`;

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
		let {options, seed, planet, size} = parseArguments(args);


		return {options, seed, planet, size};
	} catch (e) {
		helpAndExit(e, node, self);
	}

	return null;
};

const readExpectations = (path) => {
	const fullPath = Path.resolve(path);
	if (!FS.existsSync(fullPath)) throw `Expectation file ${fullPath} does not exist!`;

	const fileContents = FS.readFileSync(fullPath, "utf8");
	return PrepareExpectations(fileContents).map(ParseExpectation);
};

const key = ({seed, planet, size}) => `0x${seed.toString(0x10).padStart(4, "0")}.0x${planet.toString(0x10).padStart(4, "0")}.0x${size.toString(0x10).padStart(4, "0")}}`;

const main = (...args) => {
	let {options} = readArguments(...args);

	try {
		const expectations = {};
		readExpectations(options.e).forEach((e) => {
			const {seed, planet, size} = e;
			if (!options.p && expectations[key({
					seed,
					planet,
					size
				})]) console.warn(`Multiple expectations for world ${seed} ${planet} ${size} found!`);
			if (options.p && !expectations[key({seed, planet, size})]) {
				process.stdout.write(JSON.stringify(e));
				process.stdout.write("\n");
			}
			expectations[key({seed, planet, size})] = true;
		});

		if (options.p) process.stdout.write("\n\n");

		for (let seed = 0; seed < 100; seed++) {
			for (let size = 1; size <= 3; size++) {
				for (let planet = 1; planet <= 3; planet++) {
					if (!expectations[key({seed, planet, size})]) {
						process.stdout.write(`dumpWorld(${seed}, ${planet}, ${size});\n`);
					}
				}
			}
		}
	} catch (error) {
		process.stderr.write(`${error}\n`);
		exit(Exit.Error);
	}
};

main(...process.argv);
