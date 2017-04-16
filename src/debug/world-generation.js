import { Window, Textbox } from '/ui';
import { FileLoader } from '/util';
import Story from '/engine/story';
import { FileReader, GameData } from '/engine';
import { Type as ZoneType } from '/engine/objects/zone';

export default class {
	constructor(engine) {
		window.dbg = this;

		this._engine = engine;
		this._window = new Window();
		this._window.content.style.flexDirection = 'column';

		this._currentStory = null;
		this._readExpectations();
		this._setupInputFields();
		this._setupMapView();

		document.body.appendChild(this._window.element);

		this._rebuildWorld();
	}

	_readExpectations() {
		const fileLoader = new FileLoader('game-data/worlds.txt');
		fileLoader.onload = ({ detail: { arraybuffer } }) => {
			this.expectations = (new TextDecoder()).decode(arraybuffer).split('\n')
				.filter(function(line) {
					return line.length && line[0] !== ';';
				}).map(function(line) {
					let parts = line.split(', ').map(function(v) {
						return parseInt(v, 0x10);
					}).map(function(v) {
						return v === 0xFFFF ? -1 : v;
					});

					return {
						seed: parts[0],
						planet: parts[1],
						size: parts[2],
						data: parts.slice(3)
					};
				});
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

			this._showWorld(story.dagobah, seed, planet, size);
		});
	}

	_showDetails(i) {
		const worldItem = this._currentWorld.index(i);
		debugger; 
		const expectedWorldItem = this._currentSample && this._currentSample.slice(i * 10, (i + 1) * 10);

		const details = document.createElement('div');
		details.append('Details:');
		details.appendChild(document.createElement('br'));
		details.append(`${i%10}x${Math.floor(i/10)}`);
		details.appendChild(document.createElement('br'));
		details.append(`Zone: ${worldItem.zoneId}`);
		if (expectedWorldItem && expectedWorldItem[0] !== worldItem.zoneId) {
			details.append(` vs ${expectedWorldItem[0]}`);
		}
		details.appendChild(document.createElement('br'));
		details.append(`Type: ${this._typeName(worldItem.zoneType)}`);
		if (expectedWorldItem && expectedWorldItem[1] !== worldItem.zoneType) {
			details.append(` vs ${expectedWorldItem[1]}`);
		}
		details.appendChild(document.createElement('br'));
		details.append(`Puzzle: ${worldItem.puzzleIdx}`);
		details.appendChild(document.createElement('br'));

		details.appendChild(this._itemRow('requiredItemID', worldItem.requiredItemID, expectedWorldItem ? expectedWorldItem.requiredItemID : -1));
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
			callback({ data: new GameData(this._rawData) });
		};

		if (this._freshEngine) {
			prepareEngine();
		}

		const loader = new FileLoader('game-data/yoda.data');
		loader.onload = ({ detail: { stream } }) => {
			this._rawData = new FileReader(stream);
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
		let expectedWorld = expectedResult && expectedResult.data.slice(1000, 2000);
		expectedWorld = expectedWorld.length ? expectedWorld : null;
		this._mapContainer.clear();
		for (let i = 0; i < 100; i++) {
			this._addItem(world.index(i), expectedWorld && expectedWorld.slice(i * 10, (i + 1) * 10));
		}
		this._currentWorld = world;
		this._currentSample = expectedWorld;
	}

	_addItem(worldItem, expectedWorldItem) {
		const item = document.createElement('div');
		item.classList.add('debug-map-item');
		item.classList.add(this._classForZoneType(worldItem.zoneType));

		if (expectedWorldItem) {
			if (expectedWorldItem[6] !== worldItem.findItemID ||
				expectedWorldItem[4] !== worldItem.requiredItemID
			) {
				item.classList.add('invalid-details');
			}

			if (expectedWorldItem[0] !== worldItem.zoneId ||
				expectedWorldItem[1] !== worldItem.zoneType) {
				item.classList.add('invalid');
			} else item.classList.remove('invalid');
		} else item.classList.remove('invalid');

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
