import Scene from "./scene";
import {Tile, Zone} from "/engine/objects";
import {Point} from "/util";

export default class TransitionScene extends Scene {
	static get TRANSITION_TYPE() {
		return {
			ZONE: 0,
			ROOM: 1
		};
	}

	constructor() {
		super();

		this.type = -1;
		this.scene = null;
		this.engine = null;
		this.targetHeroLocation = null;
		this.targetZoneLocation = null;
		this.sourceZoneLocation = null;

		this.targetZone = null;
		this.targetWorld = null;

		this.state = Infinity;
		this._source = null;
		this._target = null;
		this._startTime = Infinity;
		this._duration = Infinity;
		this._zoneSwapTime = Infinity;
		this._snapAnimationToTiles = false;
		this._startTime = null;

		Object.seal(this);
	}

	willShow() {
		console.log("willShow()");

		this._setupAnimationAttributes();
		this.state = 0;

		let offset = this.scene.currentOffset;
		// TODO: fix offset for new scene that has never been visited
		if (offset === null || offset === undefined) {
			offset = new Point(0, 0);
		}

		this._source = this._takeSnapshot(this.engine.currentZone, offset.x, offset.y);
		this._startTime = performance.now();
	}

	isOpaque() {
		return true;
	}

	_setupAnimationAttributes() {
		switch (this.type) {
			case TransitionScene.TRANSITION_TYPE.ZONE:
				this._duration = 1000.0;
				this._zoneSwapTime = this._duration;
				this._snapAnimationToTiles = false;
				break;
			case TransitionScene.TRANSITION_TYPE.ROOM:
				this._duration = 1500.0;
				this._zoneSwapTime = this._duration / 2.0;
				this._snapAnimationToTiles = true;
				break;
		}
	}

	willHide() {
		console.log("willHide()");
	}

	update( /*ticks*/ ) {
		if (this._zoneSwapTime !== Infinity && this.state > this._zoneSwapTime) {
			// make sure we don't swap again
			this._zoneSwapTime = Infinity;
			this._swapZones();
		}

		if (this.state >= this._duration) {
			this.engine.sceneManager.popScene();
		}
	}

	_swapZones() {
		console.warn("_swapZones()");
		const state = this.engine.state;
		const hero = this.engine.hero;
		const engine = this.engine;
		hero.location = this.targetHeroLocation;
		state.worldLocation = this.targetZoneLocation;
		engine.currentZone = this.targetZone;
		engine.currentZone.visited = true;

		console.log(this.scene);
		this.scene.zone = engine.currentZone;
		this.scene.prepareCamera();

		state.justEntered = true;
		state.enteredByPlane = this.type === TransitionScene.TRANSITION_TYPE.ROOM;

		// state.dispatchEvent(Event.ZoneLocationDidChange);
	}

	render(renderer) {
		this.state = (performance.now() - this._startTime);

		switch (this.type) {
			case TransitionScene.TRANSITION_TYPE.ZONE:
				this.state += 8;
				this._renderZoneAnimation(renderer);
				break;
			case TransitionScene.TRANSITION_TYPE.ROOM:
				this._renderRoomAnimation(renderer);
				break;
		}
	}

	_renderZoneAnimation(renderer) {
		const w = 9.0;
		const h = 9.0;

		const world = this.targetWorld;
		this.targetZone = world.getZone(this.targetZoneLocation);
		// const currentZone = state.currentWorld.getZone(this.sourceZoneLocation);

		const xDir = this.sourceZoneLocation.x - this.targetZoneLocation.x;
		const yDir = this.sourceZoneLocation.y - this.targetZoneLocation.y;

		const animationFactor = Math.min(this.state / this._duration, 1.0);
		const animatedX = xDir * w * animationFactor;
		const animatedY = yDir * h * animationFactor;

		const tileWidth = Tile.WIDTH;
		const tileHeight = Tile.HEIGHT;

		if (!this._target) {
			let x2;
			if (xDir === -1)
				x2 = 0;
			else if (xDir === 1)
				x2 = -9;
			else
				x2 = this.scene.currentOffset.x;

			let y2;
			if (yDir === -1)
				y2 = 0;
			else if (yDir === 1)
				y2 = -9;
			else
				y2 = this.scene.currentOffset.y;
			this._target = this._takeSnapshot(this.targetZone, x2, y2);
		}

		const offsetX = animatedX * tileWidth;
		const offsetY = animatedY * tileHeight;

		renderer.renderImageData(this._source, offsetX, offsetY);
		renderer.renderImageData(this._target, offsetX - xDir * w * tileWidth, offsetY - yDir * h * tileHeight);
	}

	_renderRoomAnimation(renderer) {
		const fadeIn = this.state > this._duration / 2.0;
		const directionAdjustedState = this.state - (fadeIn ? this._duration / 2.0 : 0.0);

		let t = (directionAdjustedState / (this._duration / 2.0)) * 7;
		if (fadeIn)
			t = 5 - t;
		if (this._snapAnimationToTiles)
			t = Math.floor(t);

		const w = 9.0; // viewport width
		const h = 9.0; // viewport height

		const tileWidth = Tile.WIDTH;
		const tileHeight = Tile.HEIGHT;

		if (fadeIn) {
			this.scene.render(renderer);
		}

		renderer.fillBlackRect(0, 0, w * tileWidth, t * tileHeight);
		renderer.fillBlackRect(0, 0, t * tileWidth, h * tileHeight);
		renderer.fillBlackRect((w - t) * tileWidth, 0, t * tileWidth, h * tileHeight);
		renderer.fillBlackRect(0, (h - t) * tileHeight, h * tileWidth, t * tileHeight);
	}

	_takeSnapshot(zone, xOffset, yOffset) {
		const canvas = document.createElement("canvas");
		const viewWidth = 9,
			viewHeight = 9;
		const tileWidth = Tile.WIDTH,
			tileHeight = Tile.HEIGHT;

		canvas.width = viewWidth * tileWidth;
		canvas.height = viewHeight * tileHeight;
		const ctx = canvas.getContext("2d");

		for (let l = 0; l < Zone.LAYERS; l++) {
			for (let y = 0; y < viewHeight; y++) {
				for (let x = 0; x < viewWidth; x++) {
					const tile = zone.getTile(x - xOffset, y - yOffset, l);
					if (!tile) continue;

					ctx.drawImage(tile.image.representation, x * tileWidth, y * tileHeight);
				}
			}

			if (l === 1 && zone === this.engine.currentZone) {
				const hero = this.engine.hero;
				if (!hero.visible) continue;

				const tile = hero._appearance.getFace(hero._direction, hero._actionFrames);
				if (!tile) continue;

				const x1 = (hero._location.x + xOffset) * tileWidth;
				const y1 = (hero._location.y + yOffset) * tileHeight;
				ctx.drawImage(tile.image.representation, x1, y1);
			}
		}

		return ctx.getImageData(0, 0, viewWidth * tileWidth, viewHeight * tileHeight);
	}
}
