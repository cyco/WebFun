import "./world-generation.scss";
import { Textbox, Checkbox } from "/ui";
import { Window } from "/ui/components";
import { FileLoader } from "/util";
import Story from "/engine/story";
import { DataFileReader, GameData } from "/engine";
import ZoneType from "/engine/objects";
import { PrepareExpectations, ParseExpectation, ComparisonResult, CompareWorldItems } from "./expectation";

export default class {
	constructor(engine) {
		this._engine = engine;
		this._window = document.createElement(Window.TagName);
		this._window.content.classList.add('world-generation');

		this._currentStory = null;
		this._readExpectations();
		this._setupInputFields();
		this._setupMapView();

		document.body.appendChild(this._window.element);

		this._rebuildWorld();
	}

	_readExpectations() {
		const fileLoader = new FileLoader('game-data/worlds.txt');
		fileLoader.onload = ({detail: {arraybuffer}}) => {
			this.expectations = PrepareExpectations((new TextDecoder()).decode(arraybuffer)).map(ParseExpectation);
		};
		fileLoader.load();
	}

	_setupInputFields() {
		const inputContainer = document.createElement('div');
		this._seedInput = this._buildInputField('dbg.seed');
		inputContainer.appendChild(this._seedInput.element);
		this._planetInput = this._buildInputField('dbg.planet');
		inputContainer.appendChild(this._planetInput.element);
		this._sizeInput = this._buildInputField('dbg.size');
		inputContainer.appendChild(this._sizeInput.element);
		this._showDagobahCheckbox = new Checkbox('Show Dagobah');
		this._showDagobahCheckbox.checked = !!localStorage.load('dbg.showDagobah');
		this._showDagobahCheckbox.onchange = () => {
			localStorage.store('dbg.showDagobah', this._showDagobahCheckbox.checked);
			this._rebuildWorld();
		};
		inputContainer.appendChild(this._showDagobahCheckbox.element);
		this._window.content.appendChild(inputContainer);
	}

	_buildInputField(key) {
		const input = new Textbox();
		input.editable = true;
		input.value = localStorage.getItem(key);
		input.onchange = () => {
			localStorage.setItem(key, input.value);
			this._rebuildWorld();
		};
		input.element.style.width = '60px';
		return input;
	}

	_setupMapView() {
		const container = document.createElement('div');
		container.style.display = 'flex';

		this._mapContainer = document.createElement('div');
		this._mapContainer.classList.add('debug-map');
		this._mapContainer.onmousemove = (e) => {
			this._showDetails(Array.from(e.target.parentElement.children).indexOf(e.target));
		};
		container.appendChild(this._mapContainer);

		this._details = document.createElement('div');
		this._details.style.display = 'flex';
		this._details.style.flexDirection = 'column';
		container.appendChild(this._details);

		this._window.content.appendChild(container);
	}

	_rebuildWorld() {
		this._mapContainer.clear();
		this.withFreshEngine((engine) => {

			const seed = this.readInt(this._seedInput.value);
			const planet = this.readInt(this._planetInput.value);
			const size = this.readInt(this._sizeInput.value);

			const story = new Story(seed, planet, size);
			story.generateWorld(engine);
			this._currentStory = story;

			this._showWorld(this.showDagobah ? story.dagobah : story.world, seed, planet, size);
		});
	}

	get showDagobah() {
		return this._showDagobahCheckbox.checked;
	}

	_showDetails(i) {
		const worldItem = this._currentWorld.index(i);
		const expectedWorldItem = this._currentSample && this._currentSample[i];

		const details = document.createElement('div');
		details.append('Details:');
		details.appendChild(document.createElement('br'));
		details.append(`${i % 10}x${Math.floor(i / 10)}`);
		details.appendChild(document.createElement('br'));
		details.append(`Zone: ${worldItem.zoneID}`);
		if (expectedWorldItem && expectedWorldItem.zoneID !== worldItem.zoneID) {
			details.append(` vs ${expectedWorldItem.zoneID}`);
		}
		details.appendChild(document.createElement('br'));
		details.append(`Type: ${this._typeName(worldItem.zoneType)}`);
		if (expectedWorldItem && expectedWorldItem.zoneType !== worldItem.zoneType) {
			details.append(` vs ${this._typeName(expectedWorldItem.zoneType)}`);
		}
		details.appendChild(document.createElement('br'));
		details.append(`Puzzle: ${worldItem.puzzleIdx}`);
		details.appendChild(document.createElement('br'));

		details.appendChild(this._itemRow('requiredItemID', worldItem.requiredItemID, expectedWorldItem ? expectedWorldItem.requiredItemID : -1));
		details.appendChild(this._itemRow('additionalRequiredItemID', worldItem.additionalRequiredItemID, expectedWorldItem ? expectedWorldItem.additionalRequiredItemID : -1));
		details.appendChild(this._itemRow('findItemID', worldItem.findItemID, expectedWorldItem ? expectedWorldItem.findItemID : -1));
		details.appendChild(this._itemRow('npcID', worldItem.npcID, expectedWorldItem ? expectedWorldItem.npcID : -1));
		details.appendChild(this._itemRow('unknown606', worldItem.unknown606, expectedWorldItem ? expectedWorldItem.unknown606 : -1));

		this._details.replaceWith(details);
		this._details = details;
	}

	_itemRow(label, itemIdx, expectedItemIdx) {
		const row = document.createElement('div');
		row.style.lineHeight = '32px';
		row.append(label);

		const image = document.createElement('img');
		image.style.width = '32px';
		image.style.height = '32px';
		const tile = this._engine.data.tiles[itemIdx];
		image.src = tile ? tile.image.representation.src : Image.blankImage;
		row.appendChild(image);

		if (itemIdx !== expectedItemIdx) {
			const image = document.createElement('img');
			image.style.width = '32px';
			image.style.height = '32px';
			image.style.border = '1px solid red';
			const tile = this._engine.data.tiles[expectedItemIdx];
			image.src = tile ? tile.image.representation.src : Image.blankImage;
			row.appendChild(image);

			row.style.color = 'red';
		}

		return row;
	}

	withFreshEngine(callback) {
		const prepareEngine = () => {
			callback({data: new GameData(this._rawData)});
		};

		if (this._freshEngine) {
			prepareEngine();
		}

		const loader = new FileLoader('game-data/yoda.data');
		loader.onload = ({detail: {kaitaiStream}}) => {
			this._rawData = new DataFileReader(kaitaiStream);
			prepareEngine();
		};
		loader.load();
	}

	readInt(string) {
		string = string.toLowerCase();
		if (string.startsWith('0x')) {
			return parseInt(string.substring(2), 0x10);
		}

		return parseInt(string);
	}

	_showWorld(world, seed, planet, size) {
		const expectedResult = this.expectations.find((e) => e.seed === seed && e.planet === planet && e.size === size);
		let expectedWorld = !expectedResult ? null : (this.showDagobah ? this._expandDagobah(expectedResult.dagobah) : expectedResult.world);
		this._mapContainer.clear();

		for (let i = 0; i < 100; i++) {
			this._addItem(world.index(i), expectedWorld && expectedWorld[i]);
		}
		this._currentWorld = world;
		this._currentSample = expectedWorld;
	}

	_expandDagobah(world) {
		const result = [];
		for (let i = 0; i < 100; i++) {
			result.push({
				zoneID: -1,
				zoneType: -1,
				npcID: -1,
				findItemID: -1,
				requiredItemID: -1,
				additionalRequiredItemID: -1
			});
		}

		result[44] = world[0];
		result[45] = world[1];
		result[54] = world[2];
		result[55] = world[3];

		return result;
	}

	_addItem(worldItem, expectedWorldItem) {
		const item = document.createElement('div');
		item.classList.add('debug-map-item');
		item.classList.add(this._classForZoneType(worldItem.zoneType));

		if (expectedWorldItem) {
			const comparisonResult = CompareWorldItems(expectedWorldItem, worldItem);
			if (comparisonResult === ComparisonResult.Similar) {
				item.classList.add('invalid-details');
			} else item.classList.remove('invalid-details');

			if (comparisonResult === ComparisonResult.Different) {
				item.classList.add('invalid');
			} else item.classList.remove('invalid');
		} else {
			item.classList.remove('invalid');
			item.classList.remove('invalid-details');
		}

		this._mapContainer.appendChild(item);
	}

	_classForZoneType(type) {
		switch (type) {
			case ZoneType.Empty:
				return 'empty';
			case ZoneType.BlockadeNorth:
				return 'block-north';
			case ZoneType.BlockadeSouth:
				return 'block-south';
			case ZoneType.BlockadeEast:
				return 'block-east';
			case ZoneType.BlockadeWest:
				return 'block-west';
			case ZoneType.TravelStart:
				return 'travel';
			case ZoneType.TravelEnd:
				return 'travel';
			case ZoneType.Load:
				return 'load';
			case ZoneType.Goal:
				return 'goal';
			case ZoneType.Town:
				return 'spaceport';
			case ZoneType.Win:
				return 'win';
			case ZoneType.Lose:
				return 'lose';
			case ZoneType.Trade:
				return 'trade';
			case ZoneType.Use:
				return 'use';
			case ZoneType.Find:
				return 'find';
			case ZoneType.FindTheForce:
				return 'find-the-force';
			case ZoneType.Unknown:
				return 'unknown';
			case ZoneType.Room:
				return 'room';
			default:
				return 'none';
		}
	}

	_typeName(type) {
		switch (type) {
			case ZoneType.Empty:
				return 'Empty';
			case ZoneType.BlockadeNorth:
				return 'BlockadeNorth';
			case ZoneType.BlockadeSouth:
				return 'BlockadeSouth';
			case ZoneType.BlockadeEast:
				return 'BlockadeEast';
			case ZoneType.BlockadeWest:
				return 'BlockadeWest';
			case ZoneType.TravelStart:
				return 'TravelStart';
			case ZoneType.TravelEnd:
				return 'TravelEnd';
			case ZoneType.Room:
				return 'Room';
			case ZoneType.Load:
				return 'Load';
			case ZoneType.Goal:
				return 'Goal';
			case ZoneType.Town:
				return 'Town';
			case ZoneType.Win:
				return 'Win';
			case ZoneType.Lose:
				return 'Lose';
			case ZoneType.Trade:
				return 'Trade';
			case ZoneType.Use:
				return 'Use';
			case ZoneType.Find:
				return 'Find';
			case ZoneType.FindTheForce:
				return 'FindTheForce';
			case ZoneType.Unknown:
				return 'Unknown';
			default:
				return 'unknown';
		}
	}
}
