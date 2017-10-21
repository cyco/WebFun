import KaitaiStream from "kaitai-struct/KaitaiStream";
import Yodesk from "../../src/engine/file-format/yodesk.ksy";
import { getFixtureData } from "./fixture-loading";

export default (callback) => {
	getFixtureData("yoda.data", function (file) {
		let stream = new KaitaiStream(file);
		callback(new Yodesk(stream));
	});
};
