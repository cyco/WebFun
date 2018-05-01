import { XMLHttpRequest } from "std.dom";

const base = "base/test/fixtures/";

let getFixtureContent = name => {
	const url = buildFixtureUrl(name);
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();

	return xhr.responseText;
};

let getFixtureData = (name, callback) => {
	return new Promise(resolve => {
		const url = buildFixtureUrl(name);
		const xhr = new XMLHttpRequest();
		xhr.responseType = "arraybuffer";
		xhr.open("GET", url, true);
		xhr.onload = () => {
			const response = xhr.response;
			if (!response) {
				callback && callback(null);
				resolve(null);
				return;
			}

			callback && callback(response);
			resolve(response);
		};
		xhr.onerror = () => {
			callback && callback(null);
			resolve(null);
		};
		xhr.send();
	});
};

function buildFixtureUrl(name) {
	return base + name;
}

if (!process.browser) {
	const fs = require("fs");
	const path = require("path");

	getFixtureContent = name => {
		return fs.readFileSync(path.resolve("./assets/game-data") + "/" + name, {
			encoding: "utf8"
		});
	};

	getFixtureData = (name, callback) => {
		const buffer = fs.readFileSync(path.resolve("./assets/game-data") + "/" + name);
		callback(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
	};
}

export { getFixtureContent, getFixtureData };
