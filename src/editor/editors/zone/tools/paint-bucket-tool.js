import Tool from './tool';

export default class extends Tool {
	get name() {
		return 'Paint Bucket';
	}

	get icon() {
		return 'paint-bucket';
	}

	constructor() {
		super();

		this._tile = null;
	}

	mouseDownAt(x, y, event) {
		const z = this._editor.currentLayer;
		const currentTile = this._editor.zone.getTile(x, y, z);

		const NEW = 0;
		const MARKED = 1;
		const VISITED = 2;

		const width = this._editor.zone.width;
		const height = this._editor.zone.height;
		const size = width * height;
		const maxX = width - 1;
		const maxY = height - 1;
		const state = new Uint8Array(size);

		const open = [
			x + width * y
		];

		const neighbors = (i) => {
			const result = new Array(4);

			const x = i % width;
			const y = Math.floor(i / width);

			if (x > 0) result.push(i - 1);
			if (x < maxX) result.push(i + 1);
			if (y > 0) result.push(i - width);
			if (y < maxY) result.push(i + width);

			return result;
		};

		const isCandidate = (i) => this._editor.zone.getTile(i % width, Math.floor(i / width), z) === currentTile;
		const visit = (i) => {
			if (state[i] !== NEW) return;

			if (isCandidate(i)) {
				state[i] = MARKED;
				open.push(i);
			} else state[i] = VISITED;
		};

		visit(open[0]);

		let current;
		while ((current = open.shift()) !== undefined) {
			neighbors(current).forEach(visit);
		}

		const tile = this._editor.currentTile;
		const zone = this._editor.zone;
		state.forEach((i, idx) => i === MARKED && zone.setTile(tile, idx % width, Math.floor(idx / width), z));
	}

	set tile(t) {
		this._tile = t;
	}

	get tile() {
		return this._tile;
	}
}
