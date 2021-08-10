import { ColorPalette } from "src/engine";
import { Data } from "src/engine/file-format";

declare interface LoaderEventDetails {
	data: Data;
	palette: ColorPalette;
	progress: number;
	pixels: Uint8Array;
	strings: { [_: number]: string };
}

export default LoaderEventDetails;
