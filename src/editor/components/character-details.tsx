import { Component } from "src/ui";
import { Char, CharMovementType, CharType, CharFrame, Tile } from "src/engine/objects";
import CharacterFramePreview from "./character-frame-preview";
import { CompressedColorPalette } from "src/engine/rendering";
import { MutableChar } from "src/engine/mutable-objects";
import "./character-details.scss";

class CharacterDetails extends Component {
	public static readonly tagName = "wf-character-details";
	public static readonly observedAttributes: string[] = [];

	private _character: MutableChar;
	private _weapons: Char[];
	private _sounds: string[];
	private _tiles: Tile[];

	private _currentPreviewFrame: number = 0;
	private _framePreview: CharacterFramePreview;

	private _palette: CompressedColorPalette;

	protected connectedCallback() {
		super.connectedCallback();
		this._rebuild();
	}

	private _rebuild() {
		if (!this.isConnected) return;

		this.textContent = "";
		const container = this.render();
		this._framePreview = container.querySelector(CharacterFramePreview.tagName);
		this.appendChild(container);
	}

	private render(): Element {
		const weapons = this.weapons || [];
		const sounds = this.sounds || [];
		const tiles = this.tiles || [];

		const { reference, health, damage, type, movementType, frames } = this._character || {
			reference: -1,
			health: -1,
			damage: -1,
			type: CharType.Hero,
			movementType: CharMovementType.None,
			frames: [null, null, null] as CharFrame[]
		};

		return (
			<div>
				<CharacterFramePreview
					frame={frames[this._currentPreviewFrame]}
					palette={this._palette}
					tiles={tiles}
					onchange={({ detail: { idx, tile } }: CustomEvent) =>
						(this._character.frames[this._currentPreviewFrame % 3].tiles[idx] = tile)
					}
				/>
				<button
					onclick={() =>
						(this._framePreview.frame = this._character.frames[++this._currentPreviewFrame % 3])
					}
				>
					Step
				</button>
				<label>
					<span>Type:</span>
					<select
						className="type"
						onchange={({ currentTarget }: CustomEvent) => {
							const rawValue = (currentTarget as HTMLSelectElement).value.parseInt();
							this._character.type = CharType.fromNumber(rawValue);
							this._character.reference = -1;
							this._rebuild();
						}}
					>
						{CharType.knownTypes
							.filter(t => t)
							.map(t => (
								<option value={t.rawValue.toString()} selected={type === t}>
									{t.name}
								</option>
							))}
					</select>
				</label>
				<label>
					<span>Move:</span>
					<select
						className="movement-type"
						value={movementType.rawValue.toString()}
						onchange={({ currentTarget }: CustomEvent) => {
							const rawValue = (currentTarget as HTMLSelectElement).value.parseInt();
							this._character.movementType = CharMovementType.fromNumber(rawValue);
							this._rebuild();
						}}
					>
						{CharMovementType.knownTypes.map(type => (
							<option value={type.rawValue.toString()} selected={type === movementType}>
								{type.name}
							</option>
						))}
					</select>
				</label>
				<label>
					<span>Damage:</span>
					<input
						type="text"
						onchange={({ currentTarget }: CustomEvent) =>
							(this._character.damage = (currentTarget as HTMLSelectElement).value.parseInt())
						}
						value={damage.toString()}
					/>
				</label>
				<label>
					<span>Health:</span>
					<input
						type="text"
						onchange={({ currentTarget }: CustomEvent) =>
							(this._character.health = (currentTarget as HTMLSelectElement).value.parseInt())
						}
						value={health.toString()}
					/>
				</label>
				<div style={{ height: "10px" } as CSSStyleDeclaration} />
				<label>
					<span>Reference:</span>
				</label>
				<label>
					<span />
					<div className="tile" />
					<select
						className="weapon"
						disabled={type !== CharType.Hero && type !== CharType.Enemy}
						onchange={({ currentTarget }: CustomEvent) => {
							this._character.reference = (currentTarget as HTMLSelectElement).value.parseInt();
							this._rebuild();
						}}
					>
						<option value="-1">None</option>
						{weapons.map(weapon => (
							<option
								value={weapon.id.toString()}
								selected={
									(type === CharType.Hero || type === CharType.Enemy) &&
									reference === weapon.id
								}
							>
								{weapon.id} {weapon.name}
							</option>
						))}
					</select>
				</label>
				<label>
					<span> </span>
					<select
						className="sound"
						disabled={type !== CharType.Weapon}
						onchange={({ currentTarget }: CustomEvent) => {
							this._character.reference = (currentTarget as HTMLSelectElement).value.parseInt();
							this._rebuild();
						}}
					>
						<option value="-1">None</option>
						{sounds.map((sound, index) => (
							<option
								value={`${index}`}
								selected={type === CharType.Weapon && reference === index}
							>
								{index} {sound}
							</option>
						))}
					</select>
				</label>
			</div>
		);
	}

	protected disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	set palette(s: CompressedColorPalette) {
		this._palette = s;
		this._rebuild();
	}

	get palette() {
		return this._palette;
	}

	set character(c: MutableChar | Char) {
		if (!(c instanceof MutableChar)) c = new MutableChar(c);
		this._character = c;
		this._currentPreviewFrame = 0;
		this._rebuild();
	}

	get character() {
		return this._character;
	}

	set sounds(sounds: string[]) {
		this._sounds = sounds;
		this._rebuild();
	}

	get sounds() {
		return this._sounds;
	}

	set weapons(weapons: Char[]) {
		this._weapons = weapons;
		this._rebuild();
	}

	get weapons() {
		return this._weapons;
	}

	set tiles(tiles: Tile[]) {
		this._tiles = tiles;
		this._rebuild();
	}

	get tiles() {
		return this._tiles;
	}
}

export default CharacterDetails;
