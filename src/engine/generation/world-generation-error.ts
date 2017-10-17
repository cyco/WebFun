import { Planet, WorldSize } from "../types";

class WorldGenerationError extends Error {
	public seed: number;
	public planet: Planet;
	public size: WorldSize;
}

export default WorldGenerationError;
