import { XMLHttpRequest } from "src/std/dom";

const base = "base/test/fixtures/";

const getFixtureContent = (name: string) => {
	const url = buildFixtureUrl(name);
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();

	return xhr.responseText;
};

const getFixtureData = (name: string, callback?: (buffer: ArrayBuffer) => void): Promise<ArrayBuffer> => {
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

function buildFixtureUrl(name: string): string {
	return base + name;
}

export { getFixtureContent, getFixtureData, buildFixtureUrl };
