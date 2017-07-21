import { getFixtureData } from './fixture-loading';
import { InputStream } from 'src/util';
import Yodesk from 'src/engine/file-format/yodesk.ksy';
import KaitaiStream from 'kaitai-struct/KaitaiStream';

export default (callback) => {
	getFixtureData('yoda.data', function(file) {
		let stream = new KaitaiStream(file);
		callback(new Yodesk(stream));
	});
};
