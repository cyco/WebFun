import { GameData, ColorPalette } from "src/engine";

declare interface LoaderEventDetails {
	data: GameData;
	palette: ColorPalette;
	progress: number;
	pixels: Uint8Array;
	strings: { [_: number]: string };
}

export default LoaderEventDetails;
