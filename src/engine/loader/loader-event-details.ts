import { ColorPalette } from "../rendering";
import GameData from "../game-data";

declare interface LoaderEventDetails {
	data: GameData;
	palette: ColorPalette;
	progress: number;
	pixels: Uint8Array;
}

export default LoaderEventDetails;
