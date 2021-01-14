import "./zone-picker.scss";

import { Component } from "src/ui";
import { List } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneFilter from "./zone-filter";
import ZonePickerCell from "./zone-picker-cell";
import { ColorPalette } from "src/engine";

export const Events = {
	ZoneDidChange: "ZoneDidChange"
};

class ZonePicker extends Component {
	public static readonly Events = Events;
	public static readonly tagName = "wf-debug-zone-picker";

	public static readonly observedAttributes: string[] = [];
	private _zones: Zone[];
	private _list: List<Zone>;
	private _zone: Zone;

	constructor() {
		super();

		this._list = (
			<List
				searchDelegate={new ZoneFilter()}
				cell={
					<ZonePickerCell
						onclick={({ currentTarget }: MouseEvent) =>
							this._cellClicked(currentTarget as ZonePickerCell)
						}
					/>
				}
			/>
		) as List<Zone>;
		this._list.showBar(true);
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._list);
	}

	private _cellClicked(cell: ZonePickerCell) {
		const previousCell = this._list.querySelector(ZonePickerCell.tagName + ".active");
		if (previousCell) previousCell.classList.remove("active");

		this.zone = cell.data;
		this.changeZone(
			this.zone,
			this._list.querySelectorAll(ZonePickerCell.tagName).indexOf(cell) - 1
		);

		cell.classList.add("active");
	}

	protected disconnectedCallback(): void {
		this._list.remove();

		super.disconnectedCallback();
	}

	private changeZone(zone: Zone, index: number) {
		this.zone = zone;
		this.dispatchEvent(
			new CustomEvent(Events.ZoneDidChange, { detail: { zone, index }, bubbles: true })
		);
	}

	set zones(s: Zone[]) {
		this._zones = s;
		this._list.items = s;
	}

	get zones(): Zone[] {
		return this._zones;
	}

	set palette(p: ColorPalette) {
		const cell = this._list.cell as ZonePickerCell;
		cell.palette = p;
	}

	get palette(): ColorPalette {
		const cell = this._list.cell as ZonePickerCell;
		return cell.palette;
	}

	set zone(zone: Zone) {
		this._zone = zone;
	}

	get zone(): Zone {
		return this._zone;
	}

	set state(s: Storage) {
		this._list.state = s.prefixedWith("list");
	}

	get state(): Storage {
		return this._list.state;
	}
}

export default ZonePicker;
