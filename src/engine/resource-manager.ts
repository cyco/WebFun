import { ColorPalette } from "src/engine/rendering";
import { InputStream } from "src/util";

type ProgressHandler = (progress: number) => void;

interface ResourceManager {
	loadGameFile(progress: ProgressHandler): Promise<InputStream>;
	loadPalette(progress: ProgressHandler): Promise<ColorPalette>;
	loadSound(name: string, progress: ProgressHandler): Promise<ArrayBuffer>;
}

export default ResourceManager;
