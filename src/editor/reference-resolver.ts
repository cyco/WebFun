import { Action, Char, Instruction, Hotspot, Monster, Sound, Tile, Zone } from "src/engine/objects";

import ChangeZone from "src/engine/script/instructions/change-zone";
import GameData from "src/engine/game-data";
import PlaySound from "src/engine/script/instructions/play-sound";
import { Point } from "src/util";
import { or } from "src/util/functional";

class ReferenceResolver {
	private data: GameData;

	constructor(gameData: GameData) {
		this.data = gameData;
	}

	public findReferencesTo(type: Tile | Sound | Zone | Char | Action | Hotspot | Point | Monster) {
		if (type instanceof Tile) {
			return this.findReferencesToTile(type);
		}

		if (type instanceof Zone) {
			return this.findReferencesToZone(type);
		}

		if (type instanceof Sound) {
			return this.findReferencesToSound(type);
		}

		if (type instanceof Char) {
			return this.findReferencesToCharacter(type);
		}

		if (type instanceof Action) {
			return this.findReferencesToAction(type);
		}

		if (type instanceof Hotspot) {
			return this.findReferencesToHotspot(type);
		}

		if (type instanceof Point) {
			return this.findReferencesToPoint(type);
		}

		if (type instanceof Monster) {
			return this.findReferencesToMonster(type);
		}
	}

	private findReferencesToTile(_: Tile): any[] {
		return [];
	}

	private findReferencesToZone(zone: Zone): any[] {
		const isDoorToZone = (htsp: Hotspot) => htsp.type === Hotspot.Type.DoorIn && htsp.arg === zone.id;
		const isDoorFromZone = (htsp: Hotspot) => htsp.type === Hotspot.Type.DoorOut && htsp.arg === zone.id;
		const isChangeZoneInstruction = (i: Instruction) =>
			i.opcode === ChangeZone.Opcode && i.arguments[0] === zone.id;
		const findReferencesInZone = (z: Zone) =>
			z.hotspots
				.filter(or(isDoorToZone, isDoorFromZone))
				.concat(z.actions.map(a => a.instructions.filter(isChangeZoneInstruction)).flatten());

		return this.data.zones.map(findReferencesInZone).flatten();
	}

	private findReferencesToCharacter(_: Char): any[] {
		return [];
	}

	private findReferencesToSound(sound: Sound): any[] {
		const id = this.data.sounds.indexOf(sound);
		if (id === -1) return [];

		const zoneIsReferenceToSound = (i: Instruction) =>
			i.opcode === PlaySound.Opcode && i.arguments[0] === id;
		const findReferencesInAction = (a: Action) => a.instructions.filter(zoneIsReferenceToSound);
		const findReferencesInZone = (zone: Zone) => zone.actions.map(findReferencesInAction).flatten();
		const charIsReferenceToSound = (c: Char) => c.type === Char.Type.Weapon && c.reference === id;

		return this.data.zones
			.map(findReferencesInZone)
			.flatten()
			.concat(this.data.characters.filter(charIsReferenceToSound));
	}

	private findReferencesToAction(_: Action): any[] {
		return [];
	}

	private findReferencesToHotspot(_: Hotspot): any[] {
		return [];
	}

	private findReferencesToMonster(_: Monster): any[] {
		return [];
	}

	private findReferencesToPoint(_: Point): any[] {
		return [];
	}
}

export default ReferenceResolver;
