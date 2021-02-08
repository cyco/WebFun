import { Action, Hotspot, Monster, Tile, Zone } from "src/engine/objects";
import { Size } from "src/util";

class MutableZone extends Zone {
	get monsters(): Monster[] {
		return this._monsters;
	}

	set monsters(value: Monster[]) {
		this._monsters = value;
	}

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get planet(): Zone.Planet {
		return this._planet;
	}

	set planet(value: Zone.Planet) {
		this._planet = value;
	}

	get size(): Size {
		return this._size;
	}

	set size(value: Size) {
		this._size = value;
	}

	get type(): Zone.Type {
		return this._type;
	}

	set type(value: Zone.Type) {
		this._type = value;
	}

	get tileIDs(): Int16Array {
		return this._tileIDs;
	}

	set tileIDs(value: Int16Array) {
		this._tileIDs = value;
	}

	get hotspots(): Hotspot[] {
		return this._hotspots;
	}

	set hotspots(value: Hotspot[]) {
		this._hotspots = value;
	}

	get tileStore(): Tile[] {
		return this._tileStore;
	}

	set tileStore(value: Tile[]) {
		this._tileStore = value;
	}

	get zoneStore(): Zone[] {
		return this._zoneStore;
	}

	set zoneStore(value: Zone[]) {
		this._zoneStore = value;
	}

	get goalItems(): Tile[] {
		return this._goalItems;
	}

	set goalItems(value: Tile[]) {
		this._goalItems = value;
	}

	get requiredItems(): Tile[] {
		return this._requiredItems;
	}

	set requiredItems(value: Tile[]) {
		this._requiredItems = value;
	}

	get providedItems(): Tile[] {
		return this._providedItems;
	}

	set providedItems(value: Tile[]) {
		this._providedItems = value;
	}

	get npcs(): Tile[] {
		return this._npcs;
	}

	set npcs(value: Tile[]) {
		this._npcs = value;
	}

	get izx4Unknown(): number {
		return this._izx4Unknown;
	}

	set izx4Unknown(value: number) {
		this._izx4Unknown = value;
	}

	get izaxUnknown(): number {
		return this._izaxUnknown;
	}

	set izaxUnknown(value: number) {
		this._izaxUnknown = value;
	}

	get actions(): Action[] {
		return this._actions;
	}

	set actions(value: Action[]) {
		this._actions = value;
	}
}

export default MutableZone;
