import "./loading-view.scss";

import Component from "src/ui/component";
import { SegmentedProgressBar } from "src/ui/components";
import { Size } from "src/util";
import PaletteView from "./palette-view";
import { ColorPalette } from "src/engine";

class LoadingView extends Component {
	public static readonly tagName = "wf-loading-view";

	private _background: PaletteView = (<PaletteView size={new Size(288, 288)} />);
	private _progressBar: SegmentedProgressBar = (<SegmentedProgressBar />) as SegmentedProgressBar;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._background);
		this.appendChild(this._progressBar);
	}

	get progress(): number {
		return this._progressBar.value;
	}

	set progress(p: number) {
		this._progressBar.value = p;
	}

	set palette(p: ColorPalette) {
		this._background.palette = p;
	}

	get palette(): ColorPalette {
		return this._background.palette;
	}

	set image(p: Uint8Array) {
		this._background.image = p;
	}
	get image(): Uint8Array {
		return this._background.image;
	}
}

export default LoadingView;
