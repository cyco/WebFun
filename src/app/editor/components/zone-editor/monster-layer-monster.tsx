import "./monster-layer-monster.scss";

import { Char } from "src/engine/objects";
import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { drawTileImageData } from "src/app/webfun/rendering/canvas";

class MonsterLayerMonster extends Component {
	public static readonly tagName = "wf-monster-layer-monster";
	public character: Char;
	public palette: ColorPalette;
	public canvas = (<canvas width={32} height={32} className="pixelated" />) as HTMLCanvasElement;

	protected connectedCallback(): void {
		super.connectedCallback();
		if (!this.character) return;
		this.appendChild(this.canvas);
		this.draw();
	}

	private draw() {
		const ctx = this.canvas.getContext("2d");
		const imageData = drawTileImageData(this.character.frames[0].extensionRight, this.palette);
		ctx.putImageData(imageData, 0, 0);
	}

	protected disconnectedCallback(): void {
		super.disconnectedCallback();
	}
}

export default MonsterLayerMonster;
