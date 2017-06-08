import { getFixtureData } from './fixture-loading';
import { InputStream } from 'src/util';
import ReadFile from 'src/engine/data-format/file';

export default (callback) => {
	getFixtureData('yoda.data', function(file) {
		let stream = new InputStream(file);
		callback(ReadFile(stream));
	});
};
