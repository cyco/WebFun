import { uint8, uint32,structure, array, blob } from "/parser";

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

export const tile = structure({
	attributes: uint32,
	pixelData: blob(uint8, TILE_WIDTH * TILE_HEIGHT),
});

export const tiles = structure({
	size: uint32,
	tiles: array(tile, (s, d) => d.size / (TILE_WIDTH * TILE_HEIGHT + 4))
});
