import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class TileInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
	}

	build(){}
}

export default TileInspector;
