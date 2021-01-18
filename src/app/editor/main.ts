import { GameData } from "src/engine";
import Editor from "./editor";

export default (data: GameData = null): void => {
	const editor = new Editor();
	editor.run(data);
};
