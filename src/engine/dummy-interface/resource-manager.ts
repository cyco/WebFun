import { ReaderStream } from "src/util";
import ResourceManagerInterface from "src/engine/resource-manager";
import { ColorPalette } from "src/engine/rendering";

class ResourceManager implements ResourceManagerInterface {
	loadGameFile(_progress: (progress: number) => void): Promise<ReaderStream> {
		throw new Error("Method not implemented.");
	}

	loadPalette(_progress: (progress: number) => void): Promise<ColorPalette> {
		throw new Error("Method not implemented.");
	}

	loadSound(_name: string, _progress: (progress: number) => void): Promise<ArrayBuffer> {
		throw new Error("Method not implemented.");
	}
}

export default ResourceManager;
