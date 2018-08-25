import "babel-polyfill";
import "canvas";
import "src/std";
import "../test/helpers/polyfill";
import "src/std.dom";
import "src/extension";
import FS from "fs";
import KaitaiStream from "kaitai-struct/KaitaiStream";
import Path from "path";
import GameData from "src/engine/game-data";
import Yodesk from "src/engine/file-format/yodesk.ksy";
import * as Conditions from "src/engine/script/conditions";
import * as Instructions from "src/engine/script/instructions";
import dasherize from "dasherize";

const Exit = {
	Normal: 0,
	Usage: 1,
	Error: 2
};

const exit = (code = Exit.Normal) => process.exit(code);

const help = (node, self) => {
	process.stdout.write(`usage: ${node} ${self} [options]\n`);
	process.stdout.write("options:\n");
	process.stdout.write(`\t-d path  game file (default: ./yoda.data)\n`);
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
		d: "yoda.data"
	};

	while (args.length) {
		const arg = args.shift();

		const isOption = arg.startsWith("-");
		const optionName = isOption && arg.substr(1);

		if (isOption) {
			options[optionName] = args.shift();
		}
	}

	return {
		options
	};
};

const readArguments = (node, self, ...args) => {
	try {
		let { options } = parseArguments(args);

		return {
			options
		};
	} catch (e) {
		helpAndExit(e, node, self);
	}

	return null;
};

const readGameData = path => {
	const fullPath = Path.resolve(path);
	if (!FS.existsSync(path)) {
		throw `Game file ${fullPath} does not exist`;
	}

	try {
		const buffer = FS.readFileSync(fullPath);
		const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		const stream = new KaitaiStream(arrayBuffer);
		const rawData = new Yodesk(stream);
		return new GameData(rawData);
	} catch (e) {
		throw `Game file ${fullPath} could not be parsed!`;
	}
};

const conditionToList = condition => {
	const name =
		Object.keys(Conditions).find(key => Conditions[key].Opcode === condition.opcode) ||
		`${condition.opcode}`;
	const Condition = name ? Conditions[name] : null;

	const argCount = Math.max(Condition.Arguments, 0);
	const usedArguments = condition.arguments.slice(0, argCount);

	return [dasherize(name), ...usedArguments];
};

const instructionToList = instruction => {
	const name =
		Object.keys(Instructions).find(key => Instructions[key].Opcode === instruction.opcode) ||
		`${instruction.opcode}`;
	const Instruction = name ? Instructions[name] : null;

	const argCount = Math.max(Instruction.Arguments, 0);
	const usedArguments = instruction.arguments.slice(0, argCount);

	return [dasherize(name), ...usedArguments, ...(Instruction.UsesText ? [`"${instruction.text}"`] : [])];
};

const actionToList = (action, name) => {
	const conditions = action.conditions.map(conditionToList);
	const instructions = action.instructions.map(instructionToList);

	return ["defn", name, [], ["and", ...conditions, ["progn", ...instructions]]];
};

const toEdn = thing => {
	if (thing instanceof Array && thing.length === 0) return "[]";

	if (thing instanceof Array) {
		if (thing[0] === "defn") {
			return `(${thing[0]} ${thing[1]} [${thing[2].map(toEdn).join(" ")}]
    ${thing
		.slice(3)
		.map(toEdn)
		.join("\n\t")})`;
		}

		if (thing[0] === "and") {
			return (
				"(" +
				thing[0] +
				" " +
				thing
					.slice(1)
					.map(toEdn)
					.join("\n\t\t") +
				")"
			);
		}

		if (thing[0] === "progn") {
			return "\n\t\t" + "(" + thing.map(toEdn).join("\n\t\t ") + ")";
		}

		return "(" + thing.map(toEdn).join(" ") + ")";
	}

	// just hope for the best
	return thing;
};

const dumpAction = (zone, action, index) => {
	const actionlist = actionToList(action, `zone_${zone.id}_action_${index}`);
	process.stdout.write(toEdn(actionlist) + "\n\n");
};

const dumpZone = zone => {
	zone.actions.forEach((action, idx) => dumpAction(zone, action, idx));
	process.stdout.write("\n");
};

const dumpBaseDefinition = (thing, name) => {
	let argCount = thing.Arguments;
	const description = thing.Description || "";
	if (argCount < 0) argCount = 0;

	const functionDefinition = [
		"defn",
		dasherize(name),
		Array(argCount)
			.fill("")
			.map((_, idx) => `arg${idx}`),
		`"${description}"`
	];
	process.stdout.write(toEdn(functionDefinition));
	process.stdout.write("\n");
};

const dumpBase = () => {
	for (const name in Conditions) {
		if (!Conditions.hasOwnProperty(name)) continue;
		dumpBaseDefinition(Conditions[name], name);
	}
	process.stdout.write("\n");

	for (const name in Instructions) {
		if (!Instructions.hasOwnProperty(name)) continue;
		dumpBaseDefinition(Instructions[name], name);
	}
	process.stdout.write("\n");
	process.stdout.write("\n");
};

const main = (node, self, ...args) => {
	let { options } = readArguments(node, self, ...args);

	try {
		const gameData = readGameData(options.d);

		dumpBase();
		gameData.zones.forEach(dumpZone);
	} catch (error) {
		process.stderr.write(`${error}\n`);
		exit(Exit.Error);
	}
};

main(...process.argv);
