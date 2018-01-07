import { ModalConfirm, WindowModalSession } from 'src/ux';
import { Window } from 'src/ui/components';
import DataManager from 'src/editor/data-manager';
import { SimulatorWizard } from './components';
import { Planet, WorldSize } from 'src/engine/types';
import { World } from 'src/engine/generation';
import MutableStory from './mutable-story';
import GameController from 'src/app/game-controller';

class Simulator {
	private _data: DataManager;

	async start() {
		const wizard = <SimulatorWizard>document.createElement(SimulatorWizard.TagName);
		wizard.data = this.data;

		if (!await ModalConfirm(wizard, { confirmText: 'Simulate', abortText: 'Cancel' })) {
			return;
		}

		const { zone, requiredItem, providedItem, additionallyRequiredItem, puzzleNPC } = wizard.chosenSettings;

		const surroundingsZones = this.surroundingZoneIDsForPlanet(zone.planet).map(id => this.data.currentData.zones[id]).shuffle();
		const world = new World();

		for (let y = 4; y <= 6; y++) {
			for (let x = 4; x <= 6; x++) {
				if (x === 5 && y === 5) continue;

				const zone = surroundingsZones.pop();
				const item = world.at(x, y);
				item.zone = zone;
				item.zoneType = zone.type;
				world.zones.push(zone);
			}
		}

		const item = world.at(5, 5);
		item.zone = zone;
		item.zoneType = zone.type;
		item.puzzleIdx = 0;
		item.requiredItem = requiredItem;
		item.findItem = providedItem;
		item.additionalRequiredItem = additionallyRequiredItem;
		item.npc = puzzleNPC;

		const story = new MutableStory(0, zone.planet, WorldSize.Small);
		story.world = world;
		story.world.layDownHotspotItems();

		const gameController = new GameController();
		gameController.start(story);
	}

	private surroundingZoneIDsForPlanet(planet: Planet) {
		switch (planet) {
			case Planet.TATOOINE: return [60, 61, 62, 63, 24, 11, 30, 43];
			case Planet.ENDOR: return [655, 653, 648, 647, 608, 602, 601, 592, 591];
			case Planet.HOTH: return [262, 260, 232, 225, 226, 223, 222, 204];
		}
	}

	set data(d) {
		this._data = d;
	}

	get data() {
		return this._data;
	}
}

export default Simulator;
