import "./popover-zone-picker.scss";

import { Tile, Zone } from "src/engine/objects";
import ZonePicker, { Events as ZonePickerEvents } from "./zone-picker";

import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { DiscardingStorage } from "src/util";
import { Popover } from "src/ui/components";
import { PopoverModalSession } from "src/ux";
import { drawZoneImageData } from "src/app/webfun/rendering/canvas";

class PopoverZonePicker extends Component implements EventListenerObject {
	public static readonly tagName = "wf-debug-popover-zone-picker";
	private _canvas: HTMLCanvasElement = (<canvas />) as HTMLCanvasElement;
	public filter: (_: Zone) => boolean = null;
	private _zone: Zone;
	public _palette: ColorPalette;
	private _state: Storage = new DiscardingStorage();
	public zones: Zone[];

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._canvas);
		this.addEventListener("click", this);
	}

	public handleEvent(e: MouseEvent): void {
		if (this.disabled) return;

		const { left, top } = this.getBoundingClientRect();
		const popover = (
			<Popover
				style={{ position: "absolute", left: `${left.toString()}px`, top: `${top.toString()}px` }}
			/>
		) as Popover;
		const session = new PopoverModalSession(popover);
		const picker = (
			<ZonePicker
				zones={this.filteredZones}
				palette={this.palette}
				zone={this.zone}
				style={{ width: "258px", height: "400px" }}
				state={this.state}
			/>
		) as ZonePicker;

		picker.addEventListener(ZonePickerEvents.ZoneDidChange, (e: CustomEvent) => {
			this.pickerOnChange(picker, e);
			session.end(1);
		});
		session.onclick = (e: Event) => !(e.target as any).closest(Popover.tagName) && session.end(0);
		popover.content.appendChild(picker);
		session.run();
		picker.focus();

		e.stopPropagation();
	}

	protected pickerOnChange(_: ZonePicker, e: CustomEvent): void {
		this.zone = e.detail.zone as Zone;
		this.dispatchEvent(new CustomEvent("change", { detail: { zone: this.zone }, bubbles: true }));
	}

	protected disconnectedCallback(): void {
		this._canvas.remove();
		this.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	private redraw() {
		if (!this._zone || !this._palette) return;

		const width = this._zone.size.width * Tile.WIDTH;
		const height = this._zone.size.height * Tile.HEIGHT;
		this._canvas.setAttribute("width", `${width}`);
		this._canvas.setAttribute("height", `${height}`);

		const context = this._canvas.getContext("2d");
		context.fillStyle = "#000";
		context.fillRect(0, 0, width, height);

		const imageData = drawZoneImageData(this._zone, this._palette);
		context.putImageData(imageData, 0, 0);
	}

	public set state(s: Storage) {
		this._state = s;

		const zone = this.zones[this.state.load("zone")];
		if (zone) this.zone = zone;
	}

	public get state(): Storage {
		return this._state;
	}

	public set palette(p: ColorPalette) {
		this._palette = p;
		this.redraw();
	}

	public get palette(): ColorPalette {
		return this._palette;
	}

	public set zone(z: Zone) {
		this._zone = z;
		this.state.store("zone", z ? z.id : null);
		this.redraw();
	}

	public get zone(): Zone {
		return this._zone;
	}

	public get filteredZones(): Zone[] {
		if (!this.filter) return this.zones;
		return this.zones.filter(z => this.filter(z));
	}

	public set disabled(flag: boolean) {
		if (flag) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
}

export default PopoverZonePicker;
