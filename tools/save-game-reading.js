import "./std.dom";
import FS from "fs";
import KaitaiStream from "kaitai-struct/KaitaiStream";
import Path from "path";
import { GameData, SaveGameReader, SaveGameWriter } from "src/engine";
import Yodesk from "src/engine/file-format/yodesk.ksy";
import "src/extension";
import { InputStream } from "src/util";
import DiscardingOutputStream from "../src/util/discarding-output-stream";

const readFile = path => {
	const buffer = FS.readFileSync(path);
	const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

	return new InputStream(arrayBuffer);
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

try {
	const gameData = readGameData("assets/game-data/yoda.data");
	const inputStream = readFile(process.argv.last());
	const saveGameReader = new SaveGameReader(gameData);
	const state = saveGameReader.read(inputStream);
	console.log("[ OK ]", process.argv.last());
	process.exit(0);
} catch (e) {
	console.log("[FAIL]", process.argv.last(), "-", e.message);
	process.exit(1);
}

const outputStream = new DiscardingOutputStream(100);
const saveGameWriter = new SaveGameWriter(gameData);
saveGameWriter.write(state, outputStream);

if (outputStream.offset !== inputStream.offset) {
	console.warn(`Expected to write ${inputStream.offset} bytes but ${outputStream.offset} written!`);
} else {
	console.log(`Output should be fine`);
}
