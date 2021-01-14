import { EventTarget } from "src/util";
import Layer from "src/app/editor/components/zone-editor/layer";
import { ShortcutDescription } from "src/ux/shortcut-manager";
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
	public readonly shortcut: ShortcutDescription;

	protected zone: Zone;
	protected canvas: HTMLCanvasElement;
	public layer: Layer;

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
