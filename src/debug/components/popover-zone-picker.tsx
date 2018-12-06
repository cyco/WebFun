import { Component } from "src/ui";
import { Popover } from "src/ui/components";
import { PopoverModalSession } from "src/ux";
import { Zone, Tile } from "src/engine/objects";
import { DiscardingStorage } from "src/util";
import { ColorPalette } from "src/engine/rendering";
import ZonePicker, { Events as ZonePickerEvents } from "./zone-picker";
import { drawZoneImageData } from "src/app/rendering/canvas";
import "./popover-zone-picker.scss";

class PopoverZonePicker extends Component implements EventListenerObject {
	public static readonly tagName = "wf-debug-popover-zone-picker";
	private _canvas: HTMLCanvasElement = <canvas /> as HTMLCanvasElement;
	public filter: (_: Zone) => boolean = null;
	private _zone: Zone;
	public _palette: ColorPalette;
	private _state: Storage = new DiscardingStorage();
	public zones: Zone[];

	public connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._canvas);
		this.addEventListener("click", this);
	}

	public handleEvent(e: MouseEvent) {
		const popover = <Popover /> as Popover;
		const session = new PopoverModalSession(popover);
		const picker = (
			<ZonePicker
				zones={this.filteredZones}
				palette={this.palette}
				zone={this.zone}
				style={{ width: "300px", height: "400px" }}
				state={this.state}
			/>
		) as ZonePicker;

		picker.addEventListener(ZonePickerEvents.ZoneDidChange, (e: CustomEvent) => {
			this.pickerOnChange(picker, e);
			session.end(5);
		});
		popover.content.appendChild(picker);
		session.run();

		e.stopPropagation();
	}

	protected pickerOnChange(_: ZonePicker, e: CustomEvent) {
		this.zone = e.detail.zone as Zone;
		this.dispatchEvent(new CustomEvent("change", { detail: { zone: this.zone }, bubbles: true }));
	}

	public disconnectedCallback() {
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

	public set state(s) {
		this._state = s;

		const zone = this.zones[this.state.load("zone")];
		if (zone) this.zone = zone;
	}

	public get state() {
		return this._state;
	}

	public set palette(p) {
		this._palette = p;
		this.redraw();
	}

	public get palette() {
		return this._palette;
	}

	public set zone(z) {
		this._zone = z;
		this.state.store("zone", z.id);
		this.redraw();
	}

	public get zone() {
		return this._zone;
	}

	public get filteredZones() {
		if (!this.filter) return this.zones;
		return this.zones.filter(z => this.filter(z));
	}
}

export default PopoverZonePicker;
