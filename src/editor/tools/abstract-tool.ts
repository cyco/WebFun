import { EventTarget } from "src/util";
import { Zone } from "src/engine/objects";

export const Event = {
	DidActivate: "DidActivate",
	WillActivate: "WillActivate",
	DidDeactivate: "DidDeactivate",
	WillDeactivate: "WillDeactivate"
};

abstract class AbstractTool extends EventTarget {
	public static readonly Event = Event;
	protected zone: Zone;
	protected canvas: HTMLCanvasElement;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		this.dispatchEvent(new CustomEvent(Event.WillActivate));
		this.zone = zone;
		this.canvas = overlay;
		this.dispatchEvent(new CustomEvent(Event.DidActivate));
	}

	public deactivate(): void {
		this.dispatchEvent(new CustomEvent(Event.WillDeactivate));

		this.dispatchEvent(new CustomEvent(Event.DidDeactivate));
	}
}

export default AbstractTool;
