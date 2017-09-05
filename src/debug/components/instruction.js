import EnumName from "../enum-name";
import { Opcode } from "src/engine/script/instructions";
import InstructionThing from "./instruction-thing";

export default class extends InstructionThing {
	static get TagName() {
		return "wf-debug-instruction";
	}

	constructor(instruction = null) {
		super();
		if (instruction) this.instruction = instruction;
	}

	_tileImageNode(tile) {
		const representation = tile.image.representation;
		if (representation instanceof HTMLElement) {
			return representation.cloneNode();
		}
		return document.createElement("img");
	}

	get instruction() {
		return this._instruction;
	}

	set instruction(instruction) {
		this._instruction = instruction;
		this._title.innerText = EnumName(Opcode, instruction.opcode);

		if (instruction.opcode === Opcode.SetCounter) {
			this._title.innerText = `counter = ${instruction.arguments[0]}`;
		} else if (instruction.opcode === Opcode.AddToCounter) {
			this._title.innerText = `counter += ${instruction.arguments[0]}`;
		} else if (instruction.opcode === Opcode.SetPadding) {
			this._title.innerText = `padding = ${instruction.arguments[0]}`;
		} else if (instruction.opcode === Opcode.AddToPadding) {
			this._title.innerText = `padding += ${instruction.arguments[0]}`;
		} else if (instruction.opcode === Opcode.AddHealth) {
			this._title.innerText = `health += ${instruction.arguments[0]}`;
		} else if (instruction.opcode === Opcode.AddItem) {
			const itemId = instruction.arguments[0];
			const tile = window.engine.data.tiles[itemId];
			this._title.innerHTML = `give `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
		} else if (instruction.opcode === Opcode.RemoveItem) {
			const itemId = instruction.arguments[0];
			const tile = window.engine.data.tiles[itemId];
			this._title.innerHTML = `remove `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
		} else if (instruction.opcode === Opcode.EnableHotspot) {
			this._title.innerHTML = `enable htsp ${instruction.arguments[0]} `;
		} else if (instruction.opcode === Opcode.DisableHotspot) {
			this._title.innerHTML = `disable htsp ${instruction.arguments[0]} `;
		} else if (instruction.opcode === Opcode.PlaceTile) {
			const itemId = instruction.arguments[3];
			const tile = window.engine.data.tiles[itemId];
			this._title.innerHTML = `place `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
			this._title.innerHTML += ` at ${instruction.arguments[0]}x${instruction.arguments[1]}x${instruction.arguments[2]}`;
		} else if (instruction.opcode === Opcode.PlaceTile_Alias_) {
			const itemId = instruction.arguments[3];
			const tile = window.engine.data.tiles[itemId];
			this._title.innerHTML = `place `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
			this._title.innerHTML += ` at ${instruction.arguments[0]}x${instruction.arguments[1]}x${instruction.arguments[2]} (alias)`;
		} else if (instruction.opcode === Opcode.MoveTile) {
			this._title.innerHTML = `move `;
			this._title.innerHTML += `${instruction.arguments[0]}x${instruction.arguments[1]}x${instruction.arguments[2]} -> ${instruction.arguments[3]}x${instruction.arguments[4]}x${instruction.arguments[2]} `;
		} else if (instruction.opcode === Opcode.RemoveTile) {
			this._title.innerHTML = `remove ${instruction.arguments[0]}x${instruction.arguments[1]}x${instruction.arguments[2]}`;
		} else if (instruction.opcode === Opcode.ChangeZone) {
			this._title.innerHTML = `change zone ${instruction.arguments[0]} at ${instruction.arguments[1]}x${instruction.arguments[2]}`;
		} else if (instruction.opcode === Opcode.DrawTile) {
			const itemId = instruction.arguments[2];
			const tile = window.engine.data.tiles[itemId];
			this._title.innerHTML = `draw `;
			if (!tile) this._title.innerHTML += `${itemId}`;
			else this._title.appendChild(this._tileImageNode(tile));
			this._title.innerHTML += ` at ${instruction.arguments[0]}x${instruction.arguments[1]}`;
		} else if (instruction.opcode === Opcode.SpeakHero) {
			this._title.innerHTML = `hero: &quot;${instruction.text}&quot;`;
		} else if (instruction.opcode === Opcode.SpeakNPC) {
			this._title.innerHTML = `npc: &quot;${instruction.text}&quot;`;
		}
	}

	get type() {
		return "i";
	}
}
