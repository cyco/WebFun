import { Story, Engine } from 'src/engine';
import { World } from 'src/engine/generation';
import { Tile, Zone } from 'src/engine/objects';

class SimulatedStory extends Story {
	generateWorld(engine: Engine): void {
		const copy = new World();

		const mapItem = (i: Tile) => i && engine.data.tiles[i.id];
		const mapZone = (z: Zone) => z && engine.data.zones[z.id];

		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.WIDTH; x++) {
				const item = this._world.at(x, y);
				const copiedItem = copy.at(x, y);

				copiedItem.zone = mapZone(item.zone);
				copiedItem.zoneType = item.zoneType;
				copiedItem.puzzleIdx = item.puzzleIdx;
				copiedItem.requiredItem = mapItem(item.requiredItem);
				copiedItem.additionalRequiredItem = mapItem(item.additionalRequiredItem);
				copiedItem.npc = mapItem(item.npc);
				copiedItem.findItem = mapItem(item.findItem);
			}
		}
		copy.zones = this._world.zones.map(mapZone);

		this._world = copy;
		this._dagobah = copy;
	}

	set world(w) {
		this._world = w;
	}

	get world() {
		return this._world;
	}
}

export default SimulatedStory;
