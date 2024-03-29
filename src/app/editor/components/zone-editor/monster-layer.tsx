import "./monster-layer.scss";

import { Character, Tile, Zone } from "src/engine/objects";
import { MenuItemInit, MenuItemSeparator } from "src/ui";

import { ColorPalette } from "src/engine/rendering";
import Component from "src/ui/component";
import { ModalPrompt } from "src/ux";
import { Monster } from "src/engine/objects";
import MonsterLayerMonster from "./monster-layer-monster";
import { Point } from "src/util";
import { Updater } from "../../reference";
import ServiceContainer from "../../service-container";
import { AssetManager } from "src/engine";

class MonsterLayer extends Component {
	public static readonly tagName = "wf-monster-layer";
	public static readonly observedAttributes: string[] = [];
	public palette: ColorPalette = null;
	public tiles: Tile[] = [];
	public characters: Character[] = [];
	public di: ServiceContainer;
	private _zone: Zone = null;
	private updater: Updater;
	public assets: AssetManager = null;

	protected connectedCallback(): void {
		this.updater = this.di.get(Updater);
		this.draw();
	}

	public update(_: Point[]): void {
		this.draw();
	}

	private draw(): void {
		if (!this._zone) return;

		this.textContent = "";
		this._zone.monsters
			.groupedBy(monster => monster.position)
			.forEach(
				({
					length,
					0: {
						face,
						position: { x, y }
					}
				}) => this.appendChild(this.buildNode(new Point(x, y), length, length === 1 ? face : null))
			);
	}

	private buildNode(point: Point, count: number, face: Character) {
		return (
			<MonsterLayerMonster
				className="wf-monster-layer-monster"
				style={{
					left: `${point.x * Tile.WIDTH - 1}px`,
					top: `${point.y * Tile.HEIGHT - 1}px`
				}}
				character={face}
				palette={this.palette}>
				{" "}
				{count > 1 ? `${count}` : ""}{" "}
			</MonsterLayerMonster>
		);
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this.style.width = zone.size.width * Tile.WIDTH + "px";
		this.style.height = zone.size.height * Tile.HEIGHT + "px";

		if (this.isConnected) this.draw();
	}

	get zone(): Zone {
		return this._zone;
	}

	public getMenuForTile(point: Point): Partial<MenuItemInit>[] {
		const monsters = this._findMonstersAt(point) as Monster[];
		monsters.forEach(monster =>
			console.log(
				monster.id,
				monster.face?.name,
				monster.loot,
				monster.dropsLoot,
				monster.waypoints
			)
		);
		return [
			{
				title: "Place Monster",
				callback: (): void => {
					const monster = new Monster(
						this.zone.monsters.length,
						{
							character: this.enemies.first()?.id,
							x: point.x,
							y: point.y,
							loot: -1,
							dropsLoot: false,
							waypoints: new Int32Array()
						},
						this.assets
					);
					this.zone.monsters.push(monster);
					this.draw();
				}
			},
			...monsters
				.map(monster => [
					MenuItemSeparator,
					{
						title:
							`${monster.id.toString()}: ` +
							monster.face?.name +
							(monster.enabled ? "" : " (disabled)")
					},
					...(monster.loot !== -1
						? [
								{
									title: `Drops ${monster.loot ? this.tiles[monster.loot]?.name : "<puzzle item>"}`
								}
						  ]
						: []),
					{
						title: "Change Type",
						callback: async () => {
							const t = await ModalPrompt("Pick enemy type:", {
								defaultValue: monster.face?.id.toString(),
								options: this.enemies.map(e => ({
									label: e.name,
									value: e.id.toString()
								}))
							});
							if (!t) return;
							monster.face = this.enemies.find(e => e.id === +t);
							this.draw();
						}
					},
					{
						title: () => (monster.enabled ? "Disable" : "Enable"),
						callback: (): void => void (monster.enabled = !monster.enabled)
					},
					{
						title: "Remove",
						callback: () => {
							this.updater.deleteItem(monsters[0]);
							this.draw();
						}
					}
				])
				.flatten()
		];
	}

	private _findMonstersAt(point: Point) {
		return this.zone.monsters.filter(({ position: { x, y } }) => x === point.x && y === point.y);
	}

	private get enemies() {
		return this.characters.withType(Character.Type.Enemy);
	}
}

export default MonsterLayer;
