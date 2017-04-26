import { Window, IconButton, Textbox, Checkbox } from '/ui';
import SteppingMetronome, { Status as MetronomeStatus } from './stepping-metronome';

export default class {
	constructor(engine) {
		this._engine = engine;

		this._metronome = new SteppingMetronome(this._engine.metronome);
		this._engine.metronome = this._metronome;

		this._window = new Window();
		this._window.content.classList.add('debugger');
		this._window.content.style.flexDirection = 'column';
		this._window.content.style.width = '200px';

		this._setupDebuggerControls();
		this._setupActionList();
		this._window.content.appendChild(document.createElement('hr'));

		document.body.appendChild(this._window.element);
	}

	_setupDebuggerControls() {
		const container = document.createElement('div');
		container.classList.add('controls');

		const drawButton = new IconButton('paint-brush');
		drawButton.onclick = () => this._metronome.redraw();
		const stepButton = new IconButton('step-forward');
		stepButton.onclick = () => {
			this._metronome.step();
			this._metronome.redraw();
		};
		const fastForward = new IconButton('fast-forward');
		fastForward.onclick = () => this._metronome.run();

		const playButton = new IconButton('play');
		playButton.onclick = () => {
			if (playButton.iconName === 'play') this._metronome.start();
			else this._metronome.stop();
		};
		container.appendChild(drawButton.element);
		container.appendChild(playButton.element);
		container.appendChild(stepButton.element);
		container.appendChild(fastForward.element);
		this._window.content.appendChild(container);

		this._metronome.onstatuschange = () => {
			const isRunning = this._metronome.status === MetronomeStatus.Running;
			playButton.iconName = isRunning ? 'pause' : 'play';
			stepButton.enabled = !isRunning;
			fastForward.enabled = !isRunning;
		};
	}
	
	_setupActionList(){
		const actionList = document.createElement('div');
		actionList.classList.add('action-list');
		this._window.content.appendChild(actionList);
		this._actionList = actionList;
		this._engine.oncurrentzonechange = () => {
			console.log('Current Zone Changed');
			this.rebuildActionList();
		};
	}
}
