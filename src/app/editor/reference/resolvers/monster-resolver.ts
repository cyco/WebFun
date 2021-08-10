import { AssetManager } from "src/engine";
import { Monster, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";
import DisableMonster from "src/engine/script/instructions/disable-monster";
import EnableMonster from "src/engine/script/instructions/enable-monster";
import MonsterIsDead from "src/engine/script/conditions/monster-is-dead";

class MonsterResolver implements ResolverInterface<Monster> {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public resolve(needle: Monster, op = equal): ReferencesTo<Monster> {
		const result: ReferencesTo<Monster> = [];
		for (const zone of this._assets.getAll(Zone)) {
			if (!zone.monsters.includes(needle)) continue;

			for (const monster of zone.monsters) {
				if (op(monster.id, needle.id)) {
					result.push({ from: monster, to: monster, via: ["id"] });
					result.push({ from: zone, to: monster, via: [] });
				}
			}

			for (const action of zone.actions) {
				for (const condition of action.conditions) {
					if (condition.opcode === MonsterIsDead.Opcode && op(condition.arguments[0], needle.id)) {
						result.push({ from: condition, to: needle, via: [zone, action, 0] });
					}
				}

				for (const instruction of action.instructions) {
					if (
						instruction.opcode === DisableMonster.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action, 0] });
					}

					if (
						instruction.opcode === EnableMonster.Opcode &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action, 0] });
					}
				}
			}
		}

		return result;
	}
}

export default MonsterResolver;
