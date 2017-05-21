import { Menu, MenuItemSeparator as Separator, MenuItemState as State } from '/ui';
import { Type as EditorType } from './index';

export default (editor) => {
	const EditorItem = (title, type) => ({
		title: title,
		mnemonic: 0,
		callback: () => editor.showEditor(type),
		enabled: () => type !== undefined,
		state: () => editor.currentEditor === type ? State.On : State.Off
	});

	return new Menu([{
		title: "File",
		mnemonic: 0,
		submenu: [{
				title: "Load Data",
				mnemonic: 0,
				callback: () => editor.load()
			}, {
				title: "Save Data",
				mnemonic: 0,
				callback: () => editor.save()
			},
			Separator, {
				title: "Exit",
				mnemonic: 1,
				callback: () => editor.close()
			}
		]
	}, {
		title: "Editor",
		mnemonic: 0,
		submenu: [
			EditorItem('Zones', EditorType.Zones),
			EditorItem('Tiles', EditorType.Tiles),
			EditorItem('Sounds', EditorType.Sounds),
			EditorItem('Chars', EditorType.Chars),
			EditorItem('Palette', EditorType.Palette)
		]
	}, {
		title: "Options",
		mnemonic: 0,
		submenu: []
	}, {
		title: "Window",
		mnemonic: 0,
		submenu: [{
			title: "Hide Me!",
			mnemonic: 0
		}]
	}]);
};
