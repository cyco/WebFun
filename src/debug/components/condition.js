import EnumName from "../enum-name";
import { Opcode } from "src/engine/script/conditions";
import InstructionThing from "./instruction-thing";

export default class extends InstructionThing {
	static get TagName() {
		return "wf-debug-condition";
	}

	constructor(condition = null) {
		super();
		if (condition) this.condition = condition;
	}

	attributeChangedCallback(attribute) {
	}

	_tileImageNode(tile) {
		const representation = tile.image.representation;
		if (representation instanceof HTMLElement) {
			return representation.cloneNode();
		}
		return document.createElement("img");
	}

	get condition() {
		return this._condition;
	}

	set condition(condition) {
		this._condition = condition;
		this._title.innerText = EnumName(Opcode, condition.opcode);

		const engine = window.engine;
		const data = engine.data;
		if (condition.opcode === Opcode.EndingIs) {
			this._title.innerText = `ending == ${engine.data.tiles[condition.arguments[0]].name} (0x${condition.arguments[0].toString(0x10).padStart(2)})`;
			this._title.title = engine.data.tiles[condition.arguments[0]].name;
		} else if (condition.opcode === Opcode.CounterIs) {
			this._title.innerText = `counter == ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.CounterIsNot) {
			this._title.innerText = `counter != ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.RandomIs) {
			this._title.innerText = `random == ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.RandomIsGreaterThan) {
			this._title.innerText = `random > ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.RandomIsLessThan) {
			this._title.innerText = `random < ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.RandomIsNot) {
			this._title.innerText = `random != ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.GamesWonIs) {
			this._title.innerText = `gamesWon == ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.GamesWonIsGreaterThan) {
			this._title.innerText = `gamesWon > ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.PaddingIs) {
			this._title.innerText = `padding == ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.PaddingIsNot) {
			this._title.innerText = `padding != ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.PaddingIsGreaterThan) {
			this._title.innerText = `padding > ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.PaddingIsLessThan) {
			this._title.innerText = `padding < ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.HeroIsAt) {
			this._title.innerText = `hero at ${condition.arguments[0]}x${condition.arguments[1]}`;
		} else if (condition.opcode === Opcode.HealthIsLessThan) {
			this._title.innerText = `health < ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.HealthIsGreaterThan) {
			this._title.innerText = `health > ${condition.arguments[0]}`;
		} else if (condition.opcode === Opcode.HasItem) {
			const itemId = condition.arguments[0];
			const tile = data.tiles[itemId];
			this._title.innerHTML = `hero has `;
			if (!tile) this._title.innerHTML = `hero has ${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
		} else if (condition.opcode === Opcode.PlaceItem) {
			const itemId = condition.arguments[3];
			const tile = data.tiles[itemId];
			this._title.innerHTML = `placed `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
		} else if (condition.opcode === Opcode.Bump) {
			const itemId = condition.arguments[2];
			const tile = data.tiles[itemId];
			this._title.innerHTML = `bump `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
		} else if (condition.opcode === Opcode.TileAtIs || condition.opcode === Opcode.TileAtIsAgain) {
			const itemId = condition.arguments[0];
			const tile = data.tiles[itemId];
			this._title.innerHTML = "";
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
			this._title.innerHTML += ` at ${condition.arguments[1]}x${condition.arguments[1]}x${condition.arguments[3]}`;
		}
	}

	get type() {
		return "c";
	}
}
