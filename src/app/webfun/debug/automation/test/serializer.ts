import Expectation from "./expectation";
import Configuration from "./configuration";
import { WorldSize } from "src/engine/generation";
import { Zone } from "src/engine/objects";

class Serializer {
	public serialize(config: Configuration, input: string, expectations: Expectation[]): string {
		const {
			size,
			seed,
			planet,
			zone,
			findItem,
			npc,
			requiredItem1,
			requiredItem2,
			gamesWon,
			description,
			tags,
			inventory,
			difficulty,
			health
		} = config;

		const configuration = [];
		if (description) configuration.push(`Description: ${description}`);
		if (tags && tags.length) configuration.push(`Tag: ${tags.join(", ")}`);
		if (description || (tags && tags.length)) configuration.push(``);

		if (seed >= 0) configuration.push(`Seed: ${seed.toHex(3)}`);
		if (planet > 0) configuration.push(`Planet: ${Zone.Planet.fromNumber(planet).name}`);
		if (size > 0) configuration.push(`Size: ${WorldSize.fromNumber(size).name}`);
		if (gamesWon > 0) configuration.push(`Games Won: ${gamesWon.toString(10)}`);
		if (difficulty !== 0) configuration.push(`Difficulty: ${difficulty < 50 ? "easy" : "hard"}`);
		if (health && health !== 768) configuration.push(`Health: ${health}`);
		if (zone >= 0) configuration.push(`Zone: ${zone}`);
		if (findItem > 0) configuration.push(`Find: ${findItem}`);
		if (npc > 0) configuration.push(`NPC: ${npc}`);
		if (requiredItem1 > 0) configuration.push(`Required: ${requiredItem1}`);
		if (requiredItem2 > 0) configuration.push(`Required: ${requiredItem2}`);
		if (inventory.length) configuration.push(`Inventory: ${inventory.map(i => i).join(", ")}`);

		return [
			"-= WebFun Test =--",
			...configuration,
			"",
			"- Input -",
			input,
			"",
			"- Expect -",
			...expectations.map(e => e.format()),
			""
		].join("\n");
	}
}

export default Serializer;
