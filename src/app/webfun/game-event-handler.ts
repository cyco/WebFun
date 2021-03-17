import {
	Ammo as AmmoComponent,
	Health as HealthComponent,
	Inventory as InventoryComponent,
	SceneView,
	Weapon as WeaponComponent
} from "./ui";
import { Tile, Sound } from "src/engine/objects";
import { Hero, Engine } from "src/engine";
import { Point, Rectangle, Size } from "src/util";
import { LoseScene, ZoneScene, MapScene } from "src/engine/scenes";
import GameState from "src/engine/game-state";
import { Channel } from "src/engine/audio";
import { Yoda } from "src/variant";

class GameEventHandler {
	public handleEvent(engine: Engine, sceneView: SceneView, evt: CustomEvent): void {
		switch (evt.type) {
			case Hero.Event.HealthDidChange: {
				if (engine.hero.health > 0) {
					return;
				}

				if (engine.inventory.contains(Yoda.tileIDs.SpiritHeart)) {
					engine.hero.health = Hero.MaxHealth;
					engine.inventory.removeItem(Yoda.tileIDs.SpiritHeart);
					const flourish = engine.assets.get(Sound, Yoda.sounds.Flourish);
					engine.mixer.play(flourish, Channel.Effect);
					return;
				}

				engine.gameState = GameState.Lost;
				engine.sceneManager.pushScene(new LoseScene());
				return;
			}
			case InventoryComponent.Events.ItemActivated: {
				if (engine.gameState !== GameState.Running) {
					evt.preventDefault();
					return;
				}

				if (!(engine.sceneManager.currentScene instanceof ZoneScene)) {
					engine.sceneManager.popScene();
					return;
				}

				const item = evt.detail.item;
				if (!item) return;

				if (item.hasAttributes(Tile.Attributes.Map)) {
					engine.sceneManager.pushScene(new MapScene());
					return;
				}

				engine.metronome.stop();
				return;
			}

			case InventoryComponent.Events.ItemPlaced: {
				if (engine.gameState !== GameState.Running) {
					evt.preventDefault();
					return;
				}

				const location = evt.detail.location as Point;
				const item = evt.detail.item as Tile;

				const targetElement = document.elementFromPoint(location.x, location.y);
				const element =
					targetElement &&
					targetElement.closest(
						[
							AmmoComponent.tagName,
							WeaponComponent.tagName,
							HealthComponent.tagName,
							SceneView.tagName
						].join(",")
					);

				let used = false;
				if (element instanceof HealthComponent && item.hasAttributes(Tile.Attributes.Edible)) {
					engine.consume(item);
					used = true;
				}

				if (
					item.hasAttributes(Tile.Attributes.Weapon) &&
					(element instanceof AmmoComponent || element instanceof WeaponComponent)
				) {
					engine.equip(item);
					used = true;
				}

				if (!used) {
					const { left, top } = sceneView.getBoundingClientRect();
					const pointInView = location
						.bySubtracting(left, top)
						.dividedBy(new Size(Tile.WIDTH, Tile.HEIGHT))
						.byFlooring();

					if (!new Rectangle(new Point(0, 0), new Size(9, 9)).contains(pointInView)) {
						engine.metronome.start();
						return;
					}

					const pointInZone = pointInView.bySubtracting(
						engine.camera.offset.x,
						engine.camera.offset.y
					);
					pointInZone.z = null;
					if (!new Rectangle(new Point(0, 0), engine.currentZone.size).contains(pointInZone)) {
						engine.metronome.start();
						return;
					}

					engine.inputManager.placedTile = item;
					engine.inputManager.placedTileLocation = pointInZone;
				}

				engine.metronome.start();
			}
		}
	}
}

export default GameEventHandler;
