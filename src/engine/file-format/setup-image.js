import { structure, array } from '/parser/functions';
import { uint8, uint32 } from '/parser/types';

const IMAGE_WIDTH = 288;
const IMAGE_HEIGHT = 288;

export const setupImage = structure({
	size: uint32,
	pixelData: array(uint8, IMAGE_WIDTH * IMAGE_HEIGHT)
});
