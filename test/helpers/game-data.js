import { getFixtureData } from './fixture-loading';
import InputStream from '/util/input-stream';
import ReadFile from '/engine/data-format/file';

export default (callback) => {
	getFixtureData('yoda.data', function(file) {
		let stream = new InputStream(file);
		callback(ReadFile(stream));
	});
};
