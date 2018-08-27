import GameData from "src/engine/game-data";

const gameObject = (id: number, ...args: any[]): void => {
	const data = (document
		.querySelectorAll("*")
		.find((node: Element) => (node as any).data && (node as any).data.currentData) as any).data
		.currentData as GameData;

	console.group(...args);
	console.log("Object ", id, ...(id === -1 ? ["<none>"] : []));

	if (0 <= id && id < data.zones.length) {
		console.log("%czone", "font-style: italic");
	}

	if (0 <= id && id < data.tiles.length) {
		console.log("%ctile", "font-style: italic");
	}

	if (0 <= id && id < data.sounds.length) {
		console.log("%csound", "font-style: italic", data.sounds[id]);
	}

	if (0 <= id && id < data.characters.length) {
		console.log("%ccharacter", "font-style: italic", data.characters[id].name);
	}

	if (0 <= id && id < data.puzzles.length) {
		console.log("%cpuzzle", "font-style: italic");
	}

	console.groupEnd();
};

console.gameObject = console.gameObject || gameObject;

declare global {
	interface Console {
		gameObject(id: number, ...args: any[]): void;
	}
}

export default gameObject;
