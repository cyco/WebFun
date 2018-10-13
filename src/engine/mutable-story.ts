import Story from "./story";

class MutableStory extends Story {
	set world(w) {
		this._world = w;
	}

	get world() {
		return this._world;
	}

	set dagobah(d) {
		this._dagobah = d;
	}

	get dagobah() {
		return this._dagobah;
	}
}

export default MutableStory;
