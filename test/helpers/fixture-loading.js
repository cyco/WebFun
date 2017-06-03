import { XMLHttpRequest } from 'std.dom';

const base = "base/test/fixtures/";

function buildFixtureUrl(name) {
	return base + name;
}

function getFixtureContent(name) {
	const url = buildFixtureUrl(name);

	const xhr = new XMLHttpRequest();
	xhr.responseType = "arraybuffer";
	xhr.open("GET", url, false);
	xhr.send();
	
	return xhr.response;
}

function getFixtureData(name, callback) {	
	const url = buildFixtureUrl(name);
	
	const xhr = new XMLHttpRequest();
	xhr.responseType = "arraybuffer";
	xhr.open("GET", url, true);
	xhr.send();
	xhr.onload = () => callback(xhr.response);
}

export { getFixtureContent, getFixtureData };
