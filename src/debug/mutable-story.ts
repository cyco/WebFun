import { Story } from 'src/engine';

class MutableStory extends Story {
	set world(w) {
		this._world = w;
	}

	get world() {
		return this._world;
	}
}

export default MutableStory;
