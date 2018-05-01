import { getFixtureData } from "./fixture-loading";
import Parse from "../../src/engine/file-format/yodesk-manual";
import { Yoda } from "../../src/engine/type";
import { InputStream } from "../../src/util";

export default (type, callback) => {
	return new Promise(resolve => {
		const file = type === Yoda ? "yoda.data" : "indy.data";
		getFixtureData(file, function(file) {
			if (!file) {
				callback && callback(null);
				resolve(null);
				return;
			}

			let stream = new InputStream(file);
			const result = Parse(stream, type);
			callback && callback(result);
			resolve(result);
		});
	});
};
