import { WorldSize } from "../types";

type PlanetTypeType = number;

class WorldGenerationError extends Error {
	public seed: number;
	public planet: PlanetTypeType;
	public size: WorldSize;
}

export default WorldGenerationError;
