export default class {
	constructor() {
		this.metronome = null;
		this.sceneManager = null;
		this.renderer = null;
		this.imageFactory = null;
		this.data = null;
		this.hero = null;
		this.currentZone = null;
		this.inventory = null;
		
		this.story = null;
		
		// TODO: remove state
		this.state = {
			justEntered: true
		};
	}

	update(ticks) {
		this.sceneManager.update(ticks);
	}

	render() {
		this.sceneManager.render(this.renderer);
	}
	
	
	// TODO: remove calls and method
	setCursor(){}
	
	get dagobah(){ return this.story.dagobah; }
	get world() { return this.story.world; }
}
