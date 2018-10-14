import { Cell, Label, IconButton } from "src/ui/components";
import { Char } from "src/engine/objects";
import CSSTileSheet from "../css-tile-sheet";
import "./character-inspector-cell.scss";

class CharacterInspectorCell extends Cell<Char> {
	public static readonly tagName = "wf-character-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public onremove = (_: Event): void => void 0;
	public tileSheet: CSSTileSheet;

	public cloneNode(deep?: boolean): Node {
		const node = super.cloneNode(deep) as CharacterInspectorCell;
		node.tileSheet = this.tileSheet;
		node.onclick = this.onclick;
		node.onchange = this.onchange;
		node.onremove = this.onremove;

		return node;
	}

	protected connectedCallback() {
		const tile = this.data.frames[0].extensionRight;
		[
			<div className={"tile " + (tile ? this.tileSheet.cssClassesForTile(tile.id).join(" ") : "")} />,
			<div className="text">
				<span className="id">{this.data.id.toString()}</span>
				<Label
					className="name"
					onchange={(e: CustomEvent) =>
						this.dispatchEvent(
							new CustomEvent("change", {
								detail: { cell: this, name: (e.target as Element).textContent }
							})
						)
					}
				>
					{this.data.name}
				</Label>
			</div>,
			<IconButton
				className="fa fa-remove"
				onclick={() => this.onremove(new CustomEvent("remove", { detail: { cell: this } }))}
			/>
		].forEach(c => this.appendChild(c));
	}

	protected disconnectedCallback() {}
}

export default CharacterInspectorCell;
