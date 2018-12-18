import { Component } from "src/ui";
import { Char } from "src/engine/objects";
import { CompressedColorPalette } from "src/engine/rendering";
import { drawTileImageData } from "src/app/rendering/canvas";
import "./npc-layer-npc.scss";

class NPCLayerNPC extends Component {
	public static readonly tagName = "wf-npc-layer-npc";
	public character: Char;
	public palette: CompressedColorPalette;
	public canvas = <canvas width={32} height={32} className="pixelated" /> as HTMLCanvasElement;

	protected connectedCallback() {
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

	protected disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default NPCLayerNPC;
