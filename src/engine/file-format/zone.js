import { structure, array } from '/parser/functions';
import { uint16, uint32, character } from '/parser/types';

import { action } from './action';
import { hotspot } from './hotspot';
import { npc } from './npc';

const LAYERCOUNT = 3;

export const zone = structure({
	planet: uint16,
	size: uint32,
	index: uint16,
	marker: array(character, 4),
	size2: uint32,
	width: uint16,
	height: uint16,
	type: uint32,
	padding: uint16,
	planet2: uint16,
	tileIds: array(uint16, (s, d) => d.width * d.height * LAYERCOUNT),
	hotspots: array(hotspot, uint16),
	izax: structure({
		marker: array(character, 4),
		size: uint32,
		count1: uint16,
		npcs: array(npc, uint16),
		requiredItemIds: array(uint16, uint16),
		assignedItemIds: array(uint16, uint16)
	}),
	izx2: structure({
		marker: array(character, 4),
		size: uint32,
		providedItemIds: array(uint16, uint16)
	}),
	izx3: structure({
		marker: array(character, 4),
		size: uint32,
		npcTileIds: array(uint16, uint16)
	}),
	izx4: structure({
		marker: array(character, 4),
		size: uint32,
		unknown: uint16
	}),
	actions: array(action, uint16)
});


export const zones = array(zone, uint16);
