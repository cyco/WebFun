import Editor from '/editor';

export default {
	title: 'Debug',
	mnemonic: 0,
	submenu: [{
		title: 'Start Game',
		callback: () => false,
		enabled: () => window.data
	}, {
		title: 'Edit Data',
		callback: () => (new Editor(window.data)).show(),
		enabled: () => window.data
	}, {
		title: 'Inspect Save Game',
		callback: () => false,
	}]
};
