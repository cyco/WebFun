import WorldSize from "./world-size";
import { Zone } from "src/engine/objects";

class WorldGenerationError extends Error {
	public seed: number;
	public planet: Zone.Planet;
	public size: WorldSize;
	public history: { seed: number; error: Error }[] = [];
	public iterations: number = 0;
}

export default WorldGenerationError;
