import "./tile-view.scss";

import AbstractTileView from "./abstract-tile-view";
import { Tile } from "src/engine/objects";

class TileView extends AbstractTileView {
	public static readonly tagName = "wf-debug-tile-view";

	set tile(t: Tile) {
		super.tile = t;
		this.title = t ? t.name : "";
	}

	get tile(): Tile {
		return super.tile;
	}
}
export default TileView;
