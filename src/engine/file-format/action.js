import { structure, array } from '/parser/functions';
import { uint16, uint32, character } from '/parser/types';

export const actionItem = structure({
	opcode: uint16,
	arguments: array(uint16, 5),
	text: array(character, uint16)
});

export const action = structure({
	marker: array(character, 4),
	size: uint32,
	conditions: array(actionItem, uint16),
	instructions: array(actionItem, uint16)
});
