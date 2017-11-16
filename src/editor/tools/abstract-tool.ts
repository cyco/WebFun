import { EventTarget } from "src/util";
import { Zone } from "src/engine/objects";

export const Events = {
	DidActivate: "DidActivate",
	WillActivate: "WillActivate",
	DidDeactivate: "DidDeactivate",
	WillDeactivate: "WillDeactivate",
	ChangedTiles: "ChangedTiles"
};


abstract class AbstractTool extends EventTarget {
	public static readonly Event = Events;
	public abstract readonly name: string;
	public abstract readonly icon: string;

	protected zone: Zone;
	protected canvas: HTMLCanvasElement;
	public layer: number;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		this.dispatchEvent(new CustomEvent(Events.WillActivate));
		this.zone = zone;
		this.canvas = overlay;
		this.dispatchEvent(new CustomEvent(Events.DidActivate));
	}

	public deactivate(): void {
		this.dispatchEvent(new CustomEvent(Events.WillDeactivate));

		this.dispatchEvent(new CustomEvent(Events.DidDeactivate));
	}
}

export default AbstractTool;
