import { getFixtureData } from "./fixture-loading";
import Parse from "../../src/engine/file-format/yodesk-manual";
import { Yoda } from "../../src/engine/type";
import { InputStream } from "../../src/util";

export default callback => {
	getFixtureData("yoda.data", function(file) {
		let stream = new InputStream(file);
		callback(Parse(stream, Yoda));
	});
};
