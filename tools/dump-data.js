import FS from "fs";
import KaitaiStream from "kaitai-struct/KaitaiStream";
import Path from "path";
import "babel-polyfill";
import "canvas";
import "src/std";
import "../test/helpers/polyfill";
import "src/std.dom";
import "src/extension";
import { GameData, SaveGameReader } from "src/engine";
import Yodesk from "src/engine/file-format/yodesk.ksy";
import { InputStream } from "src/util";
import DiscardingOutputStream from "../src/util/discarding-output-stream";
import GameDataSerializer from "src/editor/game-data-serializer";
import OutputStream from "src/util/output-stream";

const readFile = (path) => {
	const buffer = FS.readFileSync(path);
	const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

	return new InputStream(arrayBuffer);
};

const readGameData = (path) => {
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

const gameData = readGameData("assets/game-data/yoda.data");
let outputStream = new DiscardingOutputStream();
const serializer = new GameDataSerializer();
serializer.serialize(gameData, outputStream);

outputStream = new OutputStream(outputStream.offset);
serializer.serialize(gameData, outputStream);
FS.writeFileSync("/Users/chris/Desktop/yoda-new.data", new Buffer(outputStream.buffer));

