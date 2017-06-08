import Settings from "/settings";
import Scene from "./scene";
import PauseScene from "./pause-scene";
import MapScene from "./map-scene";
import TransitionScene from "./transition-scene";

import {Tile,Zone,HotspotType} from "/engine/objects";
import Camera from "/engine/camera";
import Result from "/engine/script";
import { rgba, Direction, Point } from "/util";

export default class ZoneScene extends Scene {
	constructor() {
		super();

		this._camera = new Camera();
		this._actionEvaluator = null;
		this._objects = [];
		this._bullet = null;
	}

	async update(ticks) {
		const engine = this.engine;
		const hero = engine.hero;
		hero.isWalking = false;

		let stop = false;

		stop = await engine.scriptExecutor.continueActions(engine);
		if (stop) return;

		if (!this._bullet) {
			stop = await this._handleMouse();
			if (stop) return;

			stop = this._handleKeys();
			if (stop) return;
		} else if (hero._actionFrames >= hero.weapon.attackDuration) {
			this._removeBullet();
		}

		this._camera.hero = hero;
		this._camera.update(ticks);
		hero.update(ticks);
		this._objects.forEach((go) => go.update(ticks));

		await engine.scriptExecutor.runActions(engine);

		this._handleBullet();
	}

	_handleBullet() {
		const bullet = this._bullet;
		if (!bullet) return;

		const engine = this.engine;
		const zone = engine.currentZone;
		const hero = this.engine.hero;

		if (!bullet.location.isInBounds(zone.size)) {
			this._removeBullet();
			return;
		}

		if (!zone.placeWalkable(bullet.location.x, bullet.location.y)) {
			// TODO: damage thing at bullet.location;
			this._removeBullet();
			return;
		}

		if (hero._actionFrames >= hero.weapon.attackDuration) {
			this._removeBullet();
			return;
		}
	}

	_removeBullet() {
		this._objects.splice(this._objects.indexOf(this._bullet), 1);
		this._bullet = null;
	}

	render(renderer) {
		renderer.clear();

		const zone = this.zone;
		const offset = this._camera.offset;
		const hero = this.engine.hero;

		const renderObject = (object) => object.render(offset, renderer);
		for (let z = 0; z < Zone.LAYERS; z++) {
			for (let y = 0; y < zone.height; y++) {
				for (let x = 0; x < zone.width; x++) {
					renderer.renderTile(zone.getTile(x, y, z), x + offset.x, y + offset.y, z);
				}
			}

			if (z === 1) {
				if (hero.visible) hero.render(offset, renderer);
				// always show hero while debugging
				else if (Settings.drawHeroTile && renderer.fillRect instanceof Function) {
					renderer.fillRect((hero.location.x + offset.x) * Tile.WIDTH, (hero.location.y + offset.y) * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT, rgba(0, 0, 255, 0.3));
				}
				this._objects.forEach(renderObject);
			}
		}

		// show hotspots while debugging
		if (Settings.drawHotspots && renderer.fillRect instanceof Function)
			zone.hotspots.forEach((h) => {
				renderer.fillRect((h.x + offset.x) * Tile.WIDTH, (h.y + offset.y) * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT, h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3));
			});
	}

	async _handleMouse() {
		const engine = this.engine;

		const inputManager = engine.inputManager;
		const mouseLocationInView = inputManager.mouseLocationInView;

		const camera = this._camera;
		const offset = camera.offset;
		const size = camera.size;

		const hero = engine.hero;

		const mouseLocationOnZone = new Point(mouseLocationInView.x * size.width - offset.x - 0.5,
			mouseLocationInView.y * size.height - offset.y - 0.5);

		const relativeLocation = Point.subtract(mouseLocationOnZone, hero.location);

		const onHero = Math.abs(relativeLocation.x) < 0.5 && Math.abs(relativeLocation.y) < 0.5;
		const closeToViewEdge = mouseLocationInView.x < 1 / 18 || mouseLocationInView.y < 1 / 18 || mouseLocationInView.x > 17 / 18 || mouseLocationInView.y > 17 / 18;
		if (onHero && !closeToViewEdge) {
			this.engine.setCursor("blocking");
		} else {
			let direction = Direction.CalculateAngleFromRelativePoint(relativeLocation);
			this.engine.setCursor(Direction.Confine(direction));

			// TODO: set cursor
			if (isNaN(direction)) return false;

			hero.face(direction);
			if (inputManager.walk)
				await this._moveHero(direction);
		}

		return false;
	}

	_handleKeys() {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		const hero = engine.hero;

		if (inputManager.pause) {
			const pauseScene = new PauseScene();
			this.engine.sceneManager.pushScene(pauseScene);
			return true;
		}

		if (inputManager.locator) // && hero.hasLocator();
		{
			const mapScene = new MapScene();
			this.engine.sceneManager.pushScene(mapScene);
			return true;
		}

		hero.isDragging = inputManager.drag;

		hero.isAttacking = inputManager.attack; // TOOD: check if hero can attack right now
		if (hero.isAttacking) this._attackTriggered();
	}

	_attackTriggered() {
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

		// place bullet
		const bullet = weapon.produceBullet(inertia);
		bullet.location = new Point(hero.location);
		this._bullet = bullet;
		this._objects.push(bullet);
		hero._actionFrames = 0;
	}

	async _moveHero(direction) {
		const engine = this.engine;
		const state = engine.state;
		const hero = engine.hero;
		const zone = engine.currentZone;

		let diri = Direction.Confine(direction);
		let point = Direction.CalculateRelativeCoordinates(diri, 1);
		let p = new Point(point.x, point.y, 0);

		hero.isWalking = true;

		const targetPoint = Point.add(hero.location, p);
		const targetTile = zone.containsPoint(targetPoint) && zone.getTile(targetPoint.x, targetPoint.y, 1);
		if (targetTile) {
			const result = await this.engine.scriptExecutor.bump(targetPoint);
			//TODO: handle result
		}

		if (!hero.move(p, this._zone)) {
			const doTransition = this._tryTransition(p);
			if (doTransition === false) {
				// TODO: play blocked sound
			}
		} else this._executeHotspots();
	}

	_executeHotspots() {
		if (this.engine.state.justEntered) return;
		const zone = this.zone;
		const hero = this.engine.hero;

		const hotspotIsTriggered = (h) => h.enabled && h.x === hero.location.x && h.y === hero.location.y;
		const self = this;
		zone.hotspots.filter(hotspotIsTriggered).forEach((h) => self._hotspotTriggered(h));
	}

	_hotspotTriggered(hotspot) {
		const engine = this.engine;
		const zone = engine.currentZone;

		switch (hotspot.type) {
			case HotspotType.DoorIn:
				{
					const targetZone = engine.data.zones[hotspot.arg];
					let waysOut = targetZone.hotspots.filter((h) => h.type === HotspotType.DoorOut);

					if (waysOut.length !== 1) console.warn("Found multiple doors out");

					const transitionScene = new TransitionScene();
					transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
					transitionScene.targetHeroLocation = new Point(waysOut.first().x, waysOut.first().y);
					transitionScene.targetZone = targetZone;
					transitionScene.scene = engine.sceneManager.currentScene;

					let world = engine.dagobah;
					let location = world.locationOfZone(targetZone);
					if (!location) {
						world = engine.world;
						location = world.locationOfZone(targetZone);
					}
					transitionScene.targetWorld = world;

					targetZone.hotspots.filter((hotspot) => {
						return hotspot.type === HotspotType.DoorOut && hotspot.arg === -1;
					}).forEach((hotspot) => hotspot.arg = zone.id);

					if (!location) {
						world = null;
						location = null;
					}
					transitionScene.targetZoneLocation = location;
					engine.sceneManager.pushScene(transitionScene);
					return true;
				}
			case HotspotType.DoorOut:
				{
					if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

					const targetZone = engine.data.zones[hotspot.arg];

					zone.hotspots.filter((hotspot) => {
						return hotspot.type === HotspotType.DoorOut;
					}).forEach((hotspot) => hotspot.arg = -1);

					const waysIn = targetZone.hotspots.filter((hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg === zone.id);
					if (waysIn.length !== 1) console.warn("Found multiple doors we might have come through!");

					const transitionScene = new TransitionScene();
					transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
					transitionScene.targetHeroLocation = new Point(waysIn.first().x, waysIn.first().y);
					transitionScene.targetZone = targetZone;
					transitionScene.scene = engine.sceneManager.currentScene;

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
			case HotspotType.xWingFromD:
				{
					if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

					const targetZone = engine.data.zones[hotspot.arg];

					const transitionScene = new TransitionScene();
					transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
					transitionScene.targetHeroLocation = new Point(0, 0);
					transitionScene.targetZone = targetZone;
					transitionScene.scene = engine.sceneManager.currentScene;

					const world = engine.world;
					const location = world.locationOfZone(targetZone);
					if (!location) {
						// zone is not on the current planet
						return;
					}
					transitionScene.targetWorld = world;
					transitionScene.targetZoneLocation = location;
					engine.sceneManager.pushScene(transitionScene);
					this.engine.state.enteredByPlane = true;
					return true;
				}
			case HotspotType.xWingToD:
				{
					if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

					const targetZone = engine.data.zones[hotspot.arg];

					const transitionScene = new TransitionScene();
					transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
					transitionScene.targetHeroLocation = new Point(0, 0);
					transitionScene.targetZone = targetZone;
					transitionScene.scene = engine.sceneManager.currentScene;

					const location = engine.dagobah.locationOfZone(targetZone);
					if (!location) {
						// zone is not on dagobah
						return;
					}
					transitionScene.targetWorld = document.dagobah;
					transitionScene.targetZoneLocation = location;
					engine.sceneManager.pushScene(transitionScene);
					this.engine.state.enteredByPlane = true;
					return true;
				}
		}
	}

	_tryTransition(direction) {
		const engine = this.engine;
		const state = engine.state;
		const hero = engine.hero;
		const currentZone = engine.currentZone;

		const targetLocation = Point.add(hero.location, direction);
		if (currentZone.containsPoint(targetLocation)) {
			// console.log('target is on same zone!');
			return;
		}

		const zoneDirection = new Point(targetLocation.x, targetLocation.y);
		if (zoneDirection.x < 0)
			zoneDirection.x = -1;
		else if (zoneDirection.x >= 18)
			zoneDirection.x = 1;
		else
			zoneDirection.x = 0;

		if (zoneDirection.y < 0)
			zoneDirection.y = -1;
		else if (zoneDirection.y >= 18)
			zoneDirection.y = 1;
		else
			zoneDirection.y = 0;

		if (!zoneDirection.isUnidirectional()) {
			console.log("can\t move two zones at once!");
			return;
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
		if (currentZone.containsPoint(targetLocationOnCurrentZone)) return false;

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

	set zone(z) {
		this._zone = z;
		this._camera.zoneSize = {
			width: z.width,
			height: z.height
		};
	}

	get zone() {
		return this._zone;
	}

	get camera() {
		return this._camera;
	}

	get currentOffset() {
		return this._camera.offset;
	}

	prepareCamera() {
		this._camera.update(Infinity);
	}

	willShow() {
		this.engine.inputManager.locator = false;
		this.engine.inputManager.pause = false;
	}

	willHide() {
		this.engine.setCursor(null);
	}

	get objects() {
		return this._objects;
	}

	set objects(o) {
		this._objects = o;
	}
}
