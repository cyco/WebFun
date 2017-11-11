import { Zone } from "src/engine/objects";

abstract class AbstractTool {
	protected zone: Zone;
	protected canvas: HTMLCanvasElement;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		this.zone = zone;
		this.canvas = overlay;
	}

	public deactivate(): void {
	}
}

export default AbstractTool;
