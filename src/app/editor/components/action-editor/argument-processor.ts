import {
	Condition,
	ConditionsByName,
	Instruction,
	InstructionsByName,
	Type
} from "src/engine/script";

import GameData from "src/engine/game-data";
import { Point } from "src/util";
import Token from "./token";

class ArgumentProcessor {
	private definitions: { [_: string]: Condition | Instruction } = Object.assign(
		{},
		ConditionsByName,
		InstructionsByName
	);
	private _data: GameData;

	constructor(data: GameData) {
		this._data = data;
	}

	process(container: HTMLDivElement): HTMLDivElement {
		const functions = Array.from(container.querySelectorAll(".symbol"));
		functions.forEach((thing: HTMLElement) => {
			const name = thing.textContent.camelize();
			const definition = this.definitions[name];
			if (!definition) return;

			this.enrichArguments(thing, definition.Arguments);
		});

		return container;
	}

	enrichArguments(thing: Element, argumentTypes: Type[]): void {
		const argumentNodes = this.collectArgumentNodes(thing, argumentTypes.length);

		for (let i = 0; i < argumentTypes.length; i++) {
			const argumentNode = argumentNodes[i];
			const type = argumentTypes[i];

			if (type === Type.SoundID) {
				argumentNode.sound =
					+argumentNode === -1 ? null : this._data.sounds[+argumentNode]?.file ?? "<unknown>";
			}
			if (type === Type.TileID) {
				argumentNode.tile = +argumentNode === -1 ? null : this._data.tiles[+argumentNode];
			}

			if (type === Type.ZoneX) {
				argumentNode.point = new Point(
					+argumentNode.textContent,
					+argumentNode.nextElementSibling.textContent,
					0
				);
			}

			if (type === Type.ZoneY) {
				argumentNode.point = new Point(
					+argumentNode.previousElementSibling.textContent,
					+argumentNode.textContent,
					0
				);
			}

			if (type === Type.ZoneZ) {
				argumentNode.point = new Point(
					+argumentNode.previousElementSibling.previousElementSibling.textContent,
					+argumentNode.previousElementSibling.textContent,
					+argumentNode.textContent
				);
			}
		}
	}

	collectArgumentNodes(thing: Element, count: number): Token[] {
		const args: Token[] = [];
		let node = thing as Token;
		while (count) {
			node = node.nextElementSibling as Token;
			args.push(node);
			count--;
		}
		return args;
	}
}

export default ArgumentProcessor;
