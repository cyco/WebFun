import { Component } from "src/ui";
import { Char, CharMovementType, CharType } from "src/engine/objects";
import CharacterFramePreview from "./character-frame-preview";
import TileSheet from "../tile-sheet";
import "./character-details.scss";

class CharacterDetails extends Component {
	public static readonly TagName = "wf-character-details";
	public static readonly observedAttributes: string[] = [];

	private _character: Char;
	private _weapons: Char[];

	private _currentPreviewFrame: number = 0;
	private _framePreview: CharacterFramePreview;
	private _stepButton: HTMLButtonElement;
	private _typeSelector: HTMLSelectElement;
	private _movementTypeSelector: HTMLSelectElement;
	private _damageInput: HTMLInputElement;
	private _healthInput: HTMLInputElement;
	private _weaponPreview: HTMLDivElement;
	private _sound: HTMLSelectElement;
	private _weapon: HTMLSelectElement;

	private _tileSheet: TileSheet;

	constructor() {
		super();

		this._framePreview = <CharacterFramePreview>document.createElement(CharacterFramePreview.TagName);
		this._stepButton = document.createElement("button");
		this._stepButton.textContent = "Step";
		this._typeSelector = document.createElement("select");
		this._movementTypeSelector = document.createElement("select");
		this._damageInput = document.createElement("input");
		this._healthInput = document.createElement("input");
		this._weaponPreview = document.createElement("div");
		this._sound = document.createElement("select");
		this._weapon = document.createElement("select");

		this._populateTypeSelector();
		this._populateMovementTypeSelector();
	}

	private _populateTypeSelector() {
		let option = document.createElement("option");
		option.textContent = "Hero";
		option.value = "" + CharType.Hero;
		this._typeSelector.appendChild(option);

		option = document.createElement("option");
		option.textContent = "Enemy";
		option.value = "" + CharType.Enemy;
		this._typeSelector.appendChild(option);

		option = document.createElement("option");
		option.textContent = "Weapon";
		option.value = "" + CharType.Weapon;
		this._typeSelector.appendChild(option);
	}

	private _populateMovementTypeSelector() {
		CharMovementType.knownTypes.forEach(type => {
			if (type === undefined) return;

			let option = document.createElement("option");
			option.textContent = type.name;
			option.value = "" + type.rawValue;
			this._movementTypeSelector.appendChild(option);
		});
	}

	connectedCallback() {
		this.appendChild(this._framePreview);
		this.appendChild(this._stepButton);
		this.appendChild(this._typeSelector);
		this.appendChild(this._movementTypeSelector);
		this.appendChild(this._damageInput);
		this.appendChild(this._healthInput);
		this.appendChild(this._weaponPreview);
		this.appendChild(this._sound);
		this.appendChild(this._weapon);
	}

	disconnectedCallback() {
		this._framePreview.remove();
		this._stepButton.remove();
		this._typeSelector.remove();
		this._movementTypeSelector.remove();
		this._damageInput.remove();
		this._healthInput.remove();
		this._weaponPreview.remove();
		this._sound.remove();
		this._weapon.remove();
	}

	private _rebuild() {
		const char = this._character;
		this._framePreview.frame = this._character.frames[this._currentPreviewFrame];
		this._typeSelector.value = char.type.toString();
		this._movementTypeSelector.value = char._movementType.toString();
		this._damageInput.value = char.damage.toString();
		this._healthInput.value = char.health.toString();

		this._weapon.value = "-1";
		this._weapon.setAttribute("disabled", "");
		this._weaponPreview.className = "tile";
		if (char.type !== CharType.Weapon) {
			this._weapon.removeAttribute("disabled");

			const weapon = this.weapons.find(w => w.id === char.reference);
			if (weapon) {
				this._weapon.value = char.reference.toString();
				const tile = weapon.frames[0].extensionRight;
				this._weaponPreview.className += " " + (tile ? this.tileSheet.cssClassesForTile(tile.id).join(" ") : "");
			}
		}

		this._sound.value = "-1";
		this._sound.setAttribute("disabled", "");
		if (char.type === CharType.Weapon) {
			this._sound.removeAttribute("disabled");
			this._sound.value = char.reference.toString();
		}
	}

	set tileSheet(s: TileSheet) {
		this._framePreview.tileSheet = s;
		this._tileSheet = s;
	}

	get tileSheet() {
		return this._tileSheet;
	}

	set character(c: Char) {
		this._character = c;
		this._rebuild();
	}

	get character() {
		return this._character;
	}

	set sounds(sounds: string[]) {
		this._sound.textContent = "";

		const option = document.createElement("option");
		option.textContent = `None`;
		option.value = `-1`;
		this._sound.appendChild(option);

		sounds.forEach((sound, index) => {
			const option = document.createElement("option");
			option.textContent = `${index} ${sound}`;
			option.value = `${index}`;
			this._sound.appendChild(option);
		});
	}

	set weapons(weapons: Char[]) {
		this._weapon.textContent = "";

		const option = document.createElement("option");
		option.textContent = `None`;
		option.value = `-1`;
		this._weapon.appendChild(option);

		weapons.forEach(weapon => {
			const option = document.createElement("option");
			option.textContent = `${weapon.id} ${weapon.name}`;
			option.value = `${weapon.id}`;
			this._weapon.appendChild(option);
		});
		this._weapons = weapons;
	}

	get weapons() {
		return this._weapons;
	}
}

export default CharacterDetails;
