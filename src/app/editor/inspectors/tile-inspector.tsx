import "./tile-inspector.scss";

import AbstractInspector from "./abstract-inspector";
import { ColorPalette } from "src/engine/rendering";
import { IconButton } from "src/ui/components";
import { TilePicker } from "src/app/editor/components";
import ServiceContainer from "../service-container";
import { Resolver, Updater } from "../reference";
import { Tile } from "src/engine/objects";
import { Label, Button } from "src/ui/components";
import { MutableTile } from "src/engine/mutable-objects";
import getTileAttributeName from "src/app/editor/inspectors/tile-attribute-name";
import { FilePicker } from "src/ui";
import { Reader as BMPReader, Writer as BMPWriter } from "src/app/editor/bmp";
import { download, OutputStream, Size } from "src/util";
import { ceil } from "src/std/math";

class TileInspector extends AbstractInspector {
	private _palette: ColorPalette;
	private tile: MutableTile = null;
	private di = ServiceContainer.default;
	private updater = this.di.get(Updater);
	private resolver = this.di.get(Resolver);

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "532px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(<IconButton icon="plus" title="Add new tile" />);
		this.window.addTitlebarButton(
			<IconButton icon="upload" onclick={() => this.uploadTileset()} title="Upload Tileset" />
		);
		this.window.addTitlebarButton(
			<IconButton icon="download" onclick={() => this.downloadTileset()} title="Download Tileset" />
		);
	}

	public build(): void {
		const tiles = this.data.currentData.tiles as MutableTile[];
		const palette = this.data.palette;
		const lastTile = this.state.load("last-tile");
		this.tile = tiles[lastTile] ?? null;
		this.window.content.appendChild(
			<div className="wf-tile-inspector">
				<TilePicker
					palette={palette}
					tiles={tiles}
					tile={this.tile}
					state={this.state.prefixedWith("popover-tile-picker")}
					onchange={(e: Event) => this.changeTile(e)}></TilePicker>
				{this.buildDetailsForTile(this.tile)}
			</div>
		);
	}

	protected changeTile(event: Event): void {
		this.tile = (event.target as TilePicker).tile;
		this.state.store("last-tile", this.tile?.id);

		this.rebuild();
	}

	private rebuild() {
		const previousDetail = this.window.content.querySelector(".detail:last-child");
		previousDetail.replaceWith(this.buildDetailsForTile(this.tile));
	}

	private buildDetailsForTile(tile: MutableTile) {
		if (!tile) {
			return <div className="detail">no selection</div>;
		}

		return (
			<div className="detail">
				<span className="title">
					<span className="tile-id" title={tile.id.toString()}>
						{tile.id.toHex()}
					</span>
					:
					<Label onchange={(e: Event) => (tile.name = (e.target as Label).textContent)}>
						{tile.name.length ? `${tile.name}` : ""}
					</Label>
				</span>
				<div className="attributes">{this.formatAttributes(tile)}</div>
				<div className="actions">
					<Button onclick={() => this.clearImage()}>Clear Image</Button>
					<Button onclick={() => this.loadImageFromFile()}>Replace Image</Button>
				</div>
			</div>
		);
	}

	private async loadImageFromFile(): Promise<void> {
		const [file] = await FilePicker.Pick({});
		if (!file) return;

		try {
			const data = await file.provideInputStream();
			const [, pixels] = new BMPReader().read(data);
			this.tile.imageData = pixels;
			this.updatePicker();
			return;
		} catch (e) {}

		const mappedPixels = new Uint8Array(new ArrayBuffer(32 * 32));
		const image = await file.readAsImage();
		const imageData = image.toImageData();
		const memo = new Map<number, number>();
		for (let y = 0; y < 32; y++) {
			for (let x = 0; x < 32; x++) {
				const r = imageData.data[y * 32 * 4 + x * 4 + 0];
				const g = imageData.data[y * 32 * 4 + x * 4 + 1];
				const b = imageData.data[y * 32 * 4 + x * 4 + 2];
				const a = imageData.data[y * 32 * 4 + x * 4 + 3];

				const color = (r << 24) | (g << 16) | (b << 8) | a;
				mappedPixels[y * Tile.WIDTH + x] = this.findClosestColor(color, memo);
			}
		}

		this.tile.imageData = mappedPixels;
		this.updatePicker();
	}

	private clearImage() {
		this.tile.imageData = new Uint8Array(new ArrayBuffer(Tile.WIDTH * Tile.HEIGHT));
		this.updatePicker();
	}

	private updatePicker() {
		const picker = this.window.content.querySelector(TilePicker.tagName) as TilePicker;
		picker.updateTile(this.tile);
	}

	private formatAttributes(tile: Tile): Element[] {
		return tile.attributes
			.toString(0b10)
			.padStart(32, "0")
			.split("")
			.map((b, i) => (
				<code
					title={`Bit ${31 - i}: ${getTileAttributeName(31 - i, tile.attributes) ?? "<unknown>"}`}
					onclick={() => this.toggleAttribute(31 - i)}>
					{b}
				</code>
			));
	}

	private downloadTileset() {
		const tiles = this.data.currentData.tiles;
		const width = 21;
		const height = ceil(tiles.length / width);
		const size = new Size(width, height).scaleBy(Tile.WIDTH);
		const data = new OutputStream(size.width * size.height);

		const emptyRow = new Uint8Array(Tile.WIDTH);
		for (let ty = 0; ty < height; ty++) {
			for (let y = 0; y < Tile.HEIGHT; y++) {
				for (let t = 0; t < width; t++) {
					const img = tiles[ty * width + t]?.imageData;
					const slice = img ? img.slice(y * Tile.WIDTH, (y + 1) * Tile.WIDTH) : emptyRow;
					data.writeUint8Array(slice);
				}
			}
		}

		const bmpImageData = new Uint8Array(data.buffer);
		const bmpWriter = new BMPWriter();
		const bmp = bmpWriter.write(bmpImageData, this.data.palette, size);
		download(bmp, "Tileset.bmp");
	}

	private async uploadTileset() {
		const [file] = await FilePicker.Pick();
		if (!file) return;

		const image = await file.readAsImage();
		const imageData = image.toImageData();
		const width = imageData.width / Tile.WIDTH;
		const height = imageData.height / Tile.HEIGHT;

		const memo = new Map<number, number>();
		for (let ty = 0; ty < height; ty++) {
			for (let tx = 0; tx < width; tx++) {
				const tile = this.data.currentData.tiles[ty * width + tx];
				if (!tile) continue;

				const tOffset = 4 * (ty * Tile.HEIGHT * imageData.width + tx * Tile.WIDTH);

				for (let y = 0; y < Tile.HEIGHT; y++) {
					for (let x = 0; x < Tile.WIDTH; x++) {
						const offset = tOffset + 4 * (y * imageData.width + x);
						const r = imageData.data[offset + 0] & 0xff;
						const g = imageData.data[offset + 1] & 0xff;
						const b = imageData.data[offset + 2] & 0xff;
						const a = imageData.data[offset + 3] & 0xff;

						const color = (r << 24) | (g << 16) | (b << 8) | a;
						tile.imageData[y * Tile.WIDTH + x] = this.findClosestColor(color, memo);
					}
				}
			}
		}

		const picker = this.window.content.querySelector(TilePicker.tagName) as TilePicker;
		picker.tiles = this.data.currentData.tiles;
	}
	private findClosestColor(color: number, memo = new Map<number, number>()) {
		if (memo.has(color)) return memo.get(color);

		const r = (color >> 24) & 0xff;
		const g = (color >> 16) & 0xff;
		const b = (color >> 8) & 0xff;
		const a = (color >> 0) & 0xff;

		const mappedColor =
			a < 64
				? 0
				: this.data.palette
						.mapArray((c, i) => [
							(r - ((c >> 0) & 0xff)) ** 2 +
								(g - ((c >> 8) & 0xff)) ** 2 +
								(b - ((c >> 16) & 0xff)) ** 2,
							i
						])
						.slice(1)
						.sort((a, b) => a[0] - b[0])
						.first()[1];

		memo.set(color, mappedColor);
		return mappedColor;
	}

	private toggleAttribute(i: number) {
		this.tile.attributes ^= 1 << i;
		this.rebuild();
	}
}

export default TileInspector;
