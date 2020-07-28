interface Configuration {
	zone?: number;
	findItem?: number;
	requiredItem1?: number;
	requiredItem2?: number;
	npc?: number;
	seed: number;
	planet?: number;
	size?: number;
	tags: string[];
	description?: string;
	inventory: number[];
	difficulty: number;
	gamesWon?: number;
}

export default Configuration;
