type PlanetTypeType = number;
type WorldSizeType = number;

class WorldGenerationError extends Error {
	public seed: number;
	public planet: PlanetTypeType;
	public size: WorldSizeType;
}

export default WorldGenerationError;
