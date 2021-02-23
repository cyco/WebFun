import { GameData } from "src/engine";
import initialize from "./initialize";
import Editor from "./editor";

export default async (data: GameData = null): Promise<Editor> => {
	initialize();
	const editor = new Editor();
	await editor.run(data);

	return editor;
};
