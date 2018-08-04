import AbstractInspector from "./abstract-inspector";
import { PaletteView } from "../components";
import { Size, downloadImage } from "src/util";
import { Button } from "src/ui/components";

class SetupImageInspector extends AbstractInspector {
	private _paletteView: PaletteView = document.createElement(PaletteView.tagName) as PaletteView;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Setup Image";
		this.window.autosaveName = "setup-image-inspector";
		this.window.style.width = "288px";
		this.window.content.style.height = "338px";
		this.window.content.style.flexDirection = "column";

		this._paletteView.size = new Size(288, 288);
		this.window.content.appendChild(this._paletteView);

		this.window.content.appendChild(
			<div>
				<Button label="Download" onclick={() => this.saveImage()} />
			</div>
		);
	}

	public saveImage() {
		downloadImage(this._paletteView.renderedImage, "setup-image.png", "png");
	}

	build() {
		this._paletteView.palette = this.data.palette;
		this._paletteView.image = this.data.currentData.setupImageData;

		this._paletteView.redraw();
	}
}

export default SetupImageInspector;
