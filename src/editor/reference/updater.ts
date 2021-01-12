import { Zone, Hotspot, Instruction } from "src/engine/objects";
import GameData from "src/engine/game-data";
import ReferenceResolver from "./resolver";
import { greaterThan } from "src/util/functional";
import { InstructionsByName } from "src/engine/script";

class ReferenceUpdater {
	private _data: GameData;
	public constructor(data: GameData) {
		this._data = data;
	}

	public deleteItem(thing: Zone | Hotspot): void {
		/*
		const resolver = new ReferenceResolver(this._data);
		const references = resolver.findReferencesTo(thing);
		references.forEach(r => this.deleteReference(thing, r));

		const outdatedReferences = resolver.findReferencesTo(thing, greaterThan);
		outdatedReferences.forEach(r => this.updateReferences(thing, r, (v: number) => v - 1));
		*/
	}

	private deleteReference(thing: any, ref: any) {
		if (thing instanceof Zone) {
			if (ref instanceof Hotspot) {
				this.deleteHotspot(ref, thing);
			}

			if ("isInstruction" in ref) {
				const zone = this._data.zones.find(z => z.actions.some(action => action.instructions.includes(ref)));
				const action = zone.actions.find(action => action.instructions.includes(ref));
				action.instructions.splice(action.instructions.indexOf(ref), 1);
				if (action.instructions.length === 0) {
					zone.actions.splice(zone.actions.indexOf(action), 1);
				}
			}
		}
	}

	private deleteHotspot(htsp: Hotspot, zone = this._data.zones.find(z => z.hotspots.includes(htsp))): void {
		const index = zone.hotspots.indexOf(htsp);
		zone.hotspots.splice(index, 1);
		for (let a = 0; a < zone.actions.length; a++) {
			const action = zone.actions[a];
			for (let i = 0; i < action.instructions.length; i++) {
				const instruction = action.instructions[i];
				const opcode = instruction.opcode;
				if (opcode !== InstructionsByName.EnableHotspot.Opcode && opcode !== InstructionsByName.DisableHotspot.Opcode) {
					continue;
				}

				if (instruction.arguments[0] === index) {
					action.instructions.splice(i, 1);
					i -= 1;
				} else if (instruction.arguments[0] > index) {
					instruction.arguments[0] -= 1;
				}
			}

			if (action.instructions.length === 0) {
				action.instructions.splice(a, 1);
				a--;
			}
		}
	}

	private updateReferences(thing: any, reference: any, update: (id: number) => number): void {}
}

export default ReferenceUpdater;
