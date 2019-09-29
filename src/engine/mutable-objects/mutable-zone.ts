import { Zone } from "src/engine/objects";

class MutableZone extends Zone {
	get monsters() {
		return this._monsters;
	}

	set monsters(value) {
		this._monsters = value;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}

	get planet() {
		return this._planet;
	}

	set planet(value) {
		this._planet = value;
	}

	get size() {
		return this._size;
	}

	set size(value) {
		this._size = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get tileIDs() {
		return this._tileIDs;
	}

	set tileIDs(value) {
		this._tileIDs = value;
	}

	get hotspots() {
		return this._hotspots;
	}

	set hotspots(value) {
		this._hotspots = value;
	}

	get tileStore() {
		return this._tileStore;
	}

	set tileStore(value) {
		this._tileStore = value;
	}

	get zoneStore() {
		return this._zoneStore;
	}

	set zoneStore(value) {
		this._zoneStore = value;
	}

	get goalItems() {
		return this._goalItems;
	}

	set goalItems(value) {
		this._goalItems = value;
	}

	get requiredItems() {
		return this._requiredItems;
	}

	set requiredItems(value) {
		this._requiredItems = value;
	}

	get providedItems() {
		return this._providedItems;
	}

	set providedItems(value) {
		this._providedItems = value;
	}

	get puzzleNPCs() {
		return this._puzzleNPCs;
	}

	set puzzleNPCs(value) {
		this._puzzleNPCs = value;
	}

	get izx4Unknown() {
		return this._izx4Unknown;
	}

	set izx4Unknown(value) {
		this._izx4Unknown = value;
	}

	get izaxUnknown() {
		return this._izaxUnknown;
	}

	set izaxUnknown(value) {
		this._izaxUnknown = value;
	}

	get actions() {
		return this._actions;
	}

	set actions(value) {
		this._actions = value;
	}
}

export default MutableZone;
