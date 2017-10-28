import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class ZoneInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
	}
}

export default ZoneInspector;
