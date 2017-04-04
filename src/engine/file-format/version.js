import { structure } from '/parser/functions';
import { uint32 } from '/parser/types';

export const version = structure({
	version: uint32
});
