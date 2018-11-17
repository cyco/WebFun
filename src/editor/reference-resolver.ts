import GameData from "src/engine/game-data";
import { Action, Char, Hotspot, NPC, Tile, Zone } from "src/engine/objects";
import { Point } from "src/util";
import HotspotType from "src/engine/objects/hotspot-type";
import ChangeZone from "src/engine/script/instructions/change-zone";
import PlaySound from "src/engine/script/instructions/play-sound";
import { or } from "src/util/functional";
import Instruction from "src/engine/objects/instruction";
import CharType from "src/engine/objects/char-type";

class ReferenceResolver {
	private data: GameData;

	constructor(gameData: GameData) {
		this.data = gameData;
	}

	public findReferencesTo(type: Tile | string | Zone | Char | Action | Hotspot | Point | NPC) {
		if (type instanceof Tile) {
			return this.findReferencesToTile(type);
		}

		if (type instanceof Zone) {
			return this.findReferencesToZone(type);
		}

		if (typeof type === "string") {
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

		if (type instanceof NPC) {
			return this.findReferencesToNPC(type);
		}
	}

	private findReferencesToTile(_: Tile): any[] {
		return [];
	}

	private findReferencesToZone(zone: Zone): any[] {
		const isDoorToZone = (htsp: Hotspot) => htsp.type === HotspotType.DoorIn && htsp.arg === zone.id;
		const isDoorFromZone = (htsp: Hotspot) => htsp.type === HotspotType.DoorOut && htsp.arg === zone.id;
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

	private findReferencesToSound(sound: string): any[] {
		const id = this.data.sounds.indexOf(sound);
		if (id === -1) return [];

		const zoneIsReferenceToSound = (i: Instruction) =>
			i.opcode === PlaySound.Opcode && i.arguments[0] === id;
		const findReferencesInAction = (a: Action) => a.instructions.filter(zoneIsReferenceToSound);
		const findReferencesInZone = (zone: Zone) => zone.actions.map(findReferencesInAction).flatten();
		const charIsReferenceToSound = (c: Char) => c.type === CharType.Weapon && c.reference === id;

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

	private findReferencesToNPC(_: NPC): any[] {
		return [];
	}

	private findReferencesToPoint(_: Point): any[] {
		return [];
	}
}

export default ReferenceResolver;
