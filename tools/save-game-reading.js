import "../test/helpers/polyfill";
import "/extension";
import {InputStream} from "/util";
import Yodesk from "/engine/file-format/yodesk.ksy";
import {GameData, SaveGameReader} from "/engine";
import KaitaiStream from "kaitai-struct/KaitaiStream";
import Path from "path";
import FS from "fs";

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

const gameData = readGameData("game-data/yoda.data");
const saveGameData = readFile(process.argv.last());
const saveGameReader = new SaveGameReader(gameData);
saveGameReader.read(saveGameData);
