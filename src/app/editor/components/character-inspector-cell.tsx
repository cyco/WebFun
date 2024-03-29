import "./character-inspector-cell.scss";

import { Cell, IconButton, Label } from "src/ui/components";

import { Character } from "src/engine/objects";
import { ColorPalette } from "src/engine/rendering";
import TileView from "src/app/webfun/debug/components/tile-view";

class CharacterInspectorCell extends Cell<Character> {
	public static readonly tagName = "wf-character-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public onremove = (_: Event): void => void 0;
	public palette: ColorPalette;

	public cloneNode(deep?: boolean): Node {
		const node = super.cloneNode(deep) as CharacterInspectorCell;
		node.palette = this.palette;
		node.onclick = this.onclick;
		node.onchange = this.onchange;
		node.onremove = this.onremove;

		return node;
	}

	protected connectedCallback(): void {
		const tile = this.data.frames[0].extensionRight;
		[
			<TileView palette={this.palette} tile={tile} />,
			<IconButton
				className="fa fa-remove"
				onclick={() => this.onremove(new CustomEvent("remove", { detail: { cell: this } }))}
			/>,
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
					maxLength={15}>
					{this.data.name}
				</Label>
			</div>
		].forEach(c => this.appendChild(c));
	}
}

export default CharacterInspectorCell;
