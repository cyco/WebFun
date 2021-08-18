import "./puzzle-inspector-cell.scss";

import { Puzzle, Tile } from "src/engine/objects";

import { Cell, Label } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import { PopoutTilePicker } from "src/app/editor/components";

class PuzzleInspectorCell extends Cell<Puzzle> {
	public static readonly tagName = "wf-puzzle-inspector-cell";
	public static readonly observedAttributes: string[] = [];
	public palette: ColorPalette;
	public tiles: Tile[];

	public cloneNode(deep?: boolean): Node {
		const node = super.cloneNode(deep) as PuzzleInspectorCell;
		node.palette = this.palette;
		node.tiles = this.tiles;

		return node;
	}

	protected connectedCallback(): void {
		this.build();
	}

	protected disconnectedCallback(): void {
		this.textContent = "";
	}

	private build() {
		const s = this.data.strings;
		this.appendChild(
			<div>
				<PopoutTilePicker
					tile={this.data.item1}
					tiles={this.tiles}
					palette={this.palette}
					onchange={(e: Event) => this.changeTile(0, e)}></PopoutTilePicker>
				<PopoutTilePicker
					tile={this.data.item2}
					tiles={this.tiles}
					palette={this.palette}
					onchange={(e: Event) => this.changeTile(1, e)}></PopoutTilePicker>
				<div className="title">{`${this.data.id} ${this.data.name}
			${this.data.type.name}`}</div>
				<div className="unknowns">
					<div>{this.data.item1Class.name}</div>
					<div>{this.data.item2Class.name}</div>
					<div>{this.data.unknown3.toHex(2)}</div>
				</div>
				<div className="dialogs">
					<div className="dialog">
						<span className="s s1">ask</span>
						<Label onchange={(e: Event) => this.changeText(0, e)}>{`${s[0]}`}</Label>
					</div>
					<div className="dialog">
						<span className="s s2">thx</span>
						<Label onchange={(e: Event) => this.changeText(1, e)}>{`${s[1]}`}</Label>
					</div>
					<div className="dialog">
						<span className="s s3">offer</span>
						<Label onchange={(e: Event) => this.changeText(2, e)}>{`${s[2]}`}</Label>
					</div>
					<div className="dialog">
						<span className="s s4">mission</span>
						<Label onchange={(e: Event) => this.changeText(3, e)}>{`${s[3]}`}</Label>
					</div>
					<div className="dialog">
						<span className="s s5">unused</span>
						<Label onchange={(e: Event) => this.changeText(4, e)}>{`${s[4]}`}</Label>
					</div>
				</div>
			</div>
		);
	}

	private changeText(idx: number, event: Event) {
		this.data.strings[idx] = (event.target as Element).textContent;
	}

	private changeTile(idx: number, event: Event) {
		const tile = (event.target as PopoutTilePicker).tile;
		const puzzle = this.data as Puzzle;

		if (idx === 0) puzzle.item1 = tile;
		else puzzle.item2 = tile;
	}
}

export default PuzzleInspectorCell;
