import { ComponentRegistry } from "src/ui";
import * as Components from "src/ui/components";
import * as SaveGameEditorComponents from "./components";
import * as EditorComponents from "../editor/components";

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>EditorComponents);
	ComponentRegistry.sharedRegistry.registerComponent(<any>SaveGameEditorComponents);

	const ajax = new XMLHttpRequest();
	ajax.responseType = "arraybuffer";
	ajax.onload = () => {
		const setupData = async (g: GameData, p: ColorPalette) => {
			const saveGameEditor = <SaveGameEditor>document.createElement(
				SaveGameEditor.TagName
			);
			saveGameEditor.gameDataManager = new DataManager(g, p);
			saveGameEditor.file = <any>{
				name: "weapon-blaster-2.wld",
				provideInputStream() {
					return new InputStream(ajax.response);
				}
			};
			WindowManager.defaultManager.showWindow(saveGameEditor);
		};

		if (gameController.isDataLoaded()) {
			setupData(gameController.data, gameController.palette);
		} else {
			gameController.addEventListener(
				GameController.Event.DidLoadData,
				(e: CustomEvent) => setupData(e.detail.data, e.detail.palette)
			);
		}
	};
	ajax.open("GET", "weapon-blaster-2.wld", true);
	ajax.send();
};
