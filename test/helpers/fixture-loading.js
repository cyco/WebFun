import fs from 'fs';
import path from 'path';

function getFixtureContent(name) {
	return fs.readFileSync(path.resolve('./test/fixture') + '/' + name, { encoding: 'utf8' });
}

function getFixtureData(name, callback) {
	const buffer = fs.readFileSync(path.resolve('./test/fixture') + '/' + name);
	callback(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
}

export { getFixtureContent, getFixtureData };
