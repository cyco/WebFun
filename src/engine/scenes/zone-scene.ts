import Camera from "src/engine/camera";
import { HotspotType, Tile, Zone, NPC } from "src/engine/objects";
import Settings from "src/settings";
import { Direction, rgba, Point } from "src/util";
import Hotspot from "../objects/hotspot";
import AbstractRenderer from "../rendering/abstract-renderer";
import MapScene from "./map-scene";
import PauseScene from "./pause-scene";
import Scene from "./scene";
import TransitionScene from "./transition-scene";
import { EvaluationMode } from "../script";

class ZoneScene extends Scene {
	private _camera = new Camera();
	private _zone: Zone;

	get zone() {
		return this._zone;
	}

	set zone(z) {
		this._zone = z;
		this._camera.zoneSize = z.size;
	}

	get camera() {
		return this._camera;
	}

	get currentOffset() {
		return this._camera.offset;
	}

	public async update(ticks: number) {
		const engine = this.engine;
		const hero = engine.hero;
		hero.isWalking = false;

		let stop = await engine.scriptExecutor.continueActions(engine, EvaluationMode.Walk);
		if (stop) return;

		this._moveNPCs();

		await this._handleMouse();

		stop = this._handleKeys();
		if (stop) return;

		this._camera.update(ticks);
		hero.update(ticks);

		await engine.scriptExecutor.runActions(engine, EvaluationMode.Walk);
	}

	public render(renderer: AbstractRenderer) {
		renderer.clear();

		const zone = this.zone;
		const offset = this._camera.offset;
		const hero = this.engine.hero;

		const size = zone.size;
		for (let z = 0; z < Zone.LAYERS; z++) {
			for (let y = 0; y < size.height; y++) {
				for (let x = 0; x < size.width; x++) {
					const tile = zone.getTile(x, y, z);
					if (tile) {
						renderer.renderTile(tile, x + offset.x, y + offset.y, z);
					}
				}
			}

			if (z === 1) {
				if (hero.visible) hero.render(offset, renderer);
				else if (Settings.drawHeroTile && (<any>renderer).fillRect instanceof Function) {
					// always show hero while debugging
					(<any>renderer).fillRect(
						(hero.location.x + offset.x) * Tile.WIDTH,
						(hero.location.y + offset.y) * Tile.HEIGHT,
						Tile.WIDTH,
						Tile.HEIGHT,
						rgba(0, 0, 255, 0.3)
					);
				}

				zone.npcs.forEach(npc => {
					const tile = npc.face.frames[0].down;
					if (tile) {
						renderer.renderTile(tile, npc.position.x + offset.x, npc.position.y + offset.y, z);
					}
				});
			}
		}

		// show hotspots while debugging
		if (Settings.drawHotspots && (<any>renderer).fillRect instanceof Function)
			zone.hotspots.forEach(
				(h: Hotspot): void => {
					(<any>renderer).fillRect(
						(h.x + offset.x) * Tile.WIDTH,
						(h.y + offset.y) * Tile.HEIGHT,
						Tile.WIDTH,
						Tile.HEIGHT,
						h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3)
					);
				}
			);
	}

	public _executeHotspots() {
		if (this.engine.temporaryState.justEntered) return;
		const zone = this.zone;
		const hero = this.engine.hero;

		const hotspotIsTriggered = (h: Hotspot) =>
			h.enabled && h.x === hero.location.x && h.y === hero.location.y;
		zone.hotspots.filter(hotspotIsTriggered).forEach((h: Hotspot) => this._hotspotTriggered(h));
	}

	private _hotspotTriggered(hotspot: Hotspot) {
		const engine = this.engine;
		const zone = engine.currentZone;

		switch (hotspot.type) {
			case HotspotType.DoorIn: {
				const targetZone = engine.data.zones[hotspot.arg];
				let waysOut = targetZone.hotspots.filter((h: Hotspot) => h.type === HotspotType.DoorOut);

				if (waysOut.length !== 1) console.warn("Found multiple doors out");

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				transitionScene.targetHeroLocation = new Point(waysOut.first().x, waysOut.first().y);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = <ZoneScene>engine.sceneManager.currentScene;

				let world = engine.dagobah;
				let location = world.locationOfZone(targetZone);
				if (!location) {
					world = engine.world;
					location = world.locationOfZone(targetZone);
				}
				transitionScene.targetWorld = world;

				targetZone.hotspots
					.filter((hotspot: Hotspot) => {
						return hotspot.type === HotspotType.DoorOut && hotspot.arg === -1;
					})
					.forEach((hotspot: Hotspot) => (hotspot.arg = zone.id));

				if (!location) {
					world = null;
					location = null;
				}
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				return true;
			}
			case HotspotType.DoorOut: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				zone.hotspots
					.filter(hotspot => {
						return hotspot.type === HotspotType.DoorOut;
					})
					.forEach(hotspot => (hotspot.arg = -1));

				const waysIn = targetZone.hotspots.filter(
					(hotspot: Hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg === zone.id
				);
				if (waysIn.length !== 1) console.warn("Found multiple doors we might have come through!");

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				transitionScene.targetHeroLocation = new Point(waysIn.first().x, waysIn.first().y);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = <ZoneScene>engine.sceneManager.currentScene;

				let world = engine.dagobah;
				let location = world.locationOfZone(targetZone);
				if (!location) {
					world = engine.world;
					location = world.locationOfZone(targetZone);
				}
				transitionScene.targetWorld = world;

				if (!location) {
					world = null;
					location = null;
				}
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				return true;
			}
			case HotspotType.xWingFromD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingToD).first();
				transitionScene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = <ZoneScene>engine.sceneManager.currentScene;

				const world = engine.world;
				const location = world.locationOfZone(targetZone);
				if (!location) {
					// zone is not on the current planet
					return;
				}
				transitionScene.targetWorld = world;
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
			case HotspotType.xWingToD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingFromD).first();
				transitionScene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = <ZoneScene>engine.sceneManager.currentScene;

				const location = engine.dagobah.locationOfZone(targetZone);
				if (!location) {
					// zone is not on dagobah
					return;
				}
				transitionScene.targetWorld = engine.dagobah;
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
		}
	}

	private _tryTransition(direction: Point): boolean | undefined {
		const engine = this.engine;
		const state = engine.temporaryState;
		const hero = engine.hero;
		const currentZone = engine.currentZone;

		const targetLocation = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocation)) {
			// console.log('target is on same zone!');
			return false;
		}

		const zoneDirection = new Point(targetLocation.x, targetLocation.y);
		if (zoneDirection.x < 0) zoneDirection.x = -1;
		else if (zoneDirection.x >= 18) zoneDirection.x = 1;
		else zoneDirection.x = 0;

		if (zoneDirection.y < 0) zoneDirection.y = -1;
		else if (zoneDirection.y >= 18) zoneDirection.y = 1;
		else zoneDirection.y = 0;

		if (!zoneDirection.isUnidirectional()) {
			console.log("can't move two zones at once!");
			return false;
		}

		const zoneLocation = state.worldLocation;
		let world = engine.dagobah;
		if (world.locationOfZone(engine.currentZone) === null) {
			world = engine.world;
		}

		if (!zoneLocation) return;

		const targetZoneLocation = Point.add(zoneLocation, zoneDirection);
		const targetZone = world.getZone(targetZoneLocation);
		if (!targetZone) return false;

		const targetLocationOnCurrentZone = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocationOnCurrentZone)) return false;

		const targetHeroLocation = Point.add(hero.location, direction);
		targetHeroLocation.subtract(zoneDirection.x * 18, zoneDirection.y * 18);

		if (!targetZone.placeWalkable(targetHeroLocation)) {
			console.log("Tile is blocked on target zone!");
			return false;
		}

		const transitionScene = new TransitionScene();
		transitionScene.type = TransitionScene.TRANSITION_TYPE.ZONE;
		transitionScene.targetHeroLocation = targetHeroLocation;
		transitionScene.targetZoneLocation = targetZoneLocation;
		transitionScene.sourceZoneLocation = zoneLocation;
		transitionScene.targetWorld = world;
		transitionScene.scene = this;
		engine.sceneManager.pushScene(transitionScene);

		return true;
	}

	private _moveNPCs() {
		this._zone.npcs.forEach(npc => this._moveNPC(npc));
	}

	private _moveNPC(_: NPC) {}

	prepareCamera() {
		this._camera.update(Infinity);
	}

	willShow() {
		this.engine.inputManager.locator = false;
		this.engine.inputManager.pause = false;
		this.camera.hero = this.engine.hero;
	}

	willHide() {}

	private async _handleMouse(): Promise<void> {
		const engine = this.engine;

		const inputManager = engine.inputManager;
		const mouseLocationInView = inputManager.mouseLocationInView;

		const camera = this._camera;
		const offset = camera.offset;
		const size = camera.size;
		const hero = engine.hero;

		const mouseLocationOnZone = new Point(
			mouseLocationInView.x * size.width - offset.x - 0.5,
			mouseLocationInView.y * size.height - offset.y - 0.5
		);

		const relativeLocation = Point.subtract(mouseLocationOnZone, hero.location);

		const onHero = Math.abs(relativeLocation.x) < 0.5 && Math.abs(relativeLocation.y) < 0.5;
		const closeToViewEdge =
			mouseLocationInView.x < 1 / 18 ||
			mouseLocationInView.y < 1 / 18 ||
			mouseLocationInView.x > 17 / 18 ||
			mouseLocationInView.y > 17 / 18;
		if (!onHero || closeToViewEdge) {
			let direction = Direction.CalculateAngleFromRelativePoint(relativeLocation);

			if (isNaN(direction)) return;

			hero.face(direction);
			if (inputManager.walk) await this._moveHero(direction);
		}

		return;
	}

	private _handleKeys(): boolean {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		const hero = engine.hero;

		if (inputManager.pause) {
			const pauseScene = new PauseScene();
			this.engine.sceneManager.pushScene(pauseScene);
			return true;
		}

		if (inputManager.locator) {
			// && hero.hasLocator();
			const mapScene = new MapScene();
			this.engine.sceneManager.pushScene(mapScene);
			return true;
		}

		hero.isDragging = inputManager.drag;

		hero.isAttacking = inputManager.attack; // TOOD: check if hero can attack right now
		if (hero.isAttacking) this._attackTriggered();
		return false;
	}

	private _attackTriggered() {
		const hero = this.engine.hero;
		const weapon = hero.weapon;
		const zone = this.engine.currentZone;

		// do nothing if no weapon is equipped
		if (!weapon) {
			hero.isAttacking = false;
			return;
		}

		// do nothing if hero is looking away from the zone
		const point = Direction.CalculateRelativeCoordinates(hero.direction, 1);
		const inertia = new Point(point.x, point.y, 0);
		if (!Point.add(hero.location, inertia).isInBounds(zone.size)) {
			hero.isAttacking = false;
			return;
		}
	}

	private async _moveHero(direction: number): Promise<void> {
		const engine = this.engine;
		const hero = engine.hero;
		const zone = engine.currentZone;

		let diri = Direction.Confine(direction);
		let point = Direction.CalculateRelativeCoordinates(diri, 1);
		let p = new Point(point.x, point.y, 0);

		hero.isWalking = true;

		const targetPoint = Point.add(hero.location, p);
		const targetTile = zone.bounds.contains(targetPoint) && zone.getTile(targetPoint.x, targetPoint.y, 1);
		if (targetTile) {
			await this.engine.scriptExecutor.bump(targetPoint);
			//TODO: handle result
		}

		if (!hero.move(p, this.zone)) {
			const doTransition = this._tryTransition(p);
			if (doTransition === false) {
				// TODO: play blocked sound
			}
		} else this._executeHotspots();
	}
}

export default ZoneScene;
