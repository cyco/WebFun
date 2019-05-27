import { XMLHttpRequest } from "std/dom";

const base = "base/test/fixtures/";

const getFixtureContent = name => {
	const url = buildFixtureUrl(name);
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();

	return xhr.responseText;
};

const getFixtureData = (name, callback) => {
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

export { getFixtureContent, getFixtureData, buildFixtureUrl };
