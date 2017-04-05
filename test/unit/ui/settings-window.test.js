import sandboxed from '../../helpers/dom-sandbox';
import SettingsWindow from '/ui/settings-window';

describe('SettingsWindow', sandboxed(function(sand) {
	it('displays a window with an optional slider that is commonly used in let ious settings windows', () =>  {
		let window = new SettingsWindow();
	});
}));
