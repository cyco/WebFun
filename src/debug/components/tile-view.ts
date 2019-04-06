import "./tile-view.scss";

import AbstractTileView from "./abstract-tile-view";

class TileView extends AbstractTileView {
	public static readonly tagName = "wf-debug-tile-view";

	set tile(t) {
		super.tile = t;
		this.title = t ? t.name : "";
	}

	get tile() {
		return super.tile;
	}
}
export default TileView;
