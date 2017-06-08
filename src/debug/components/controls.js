import "./controls.scss";
import { Component } from '/ui';
import { IconButton } from '/ui/components';

export default class extends Component {
	static get TagName() {
		return 'wf-debug-controls';
	}

	static get observedAttributes() {
		return ['running'];
	}

	constructor() {
		super();

		this.ontogglepause = null;
		this.onstep = null;
		this.ondraw = null;
		this.onfastforward = null;

		const drawButton = new IconButton();
		drawButton.icon = 'paint-brush';
		drawButton.onclick = () => this.ondraw instanceof Function ? this.ondraw() : null;
		this._drawButton = drawButton;

		const stepButton = new IconButton();
		stepButton.icon = 'step-forward';
		stepButton.onclick = () => this.onstep instanceof Function ? this.onstep() : null;
		this._stepButton = stepButton;

		const fastForward = new IconButton();
		fastForward.icon = 'fast-forward';
		fastForward.onclick = () => this.onfastforward instanceof Function ? this.onfastforward() : null;
		this._fastForwardButton = fastForward;

		const playButton = new IconButton();
		playButton.icon = 'play';
		playButton.onclick = () => this.ontogglepause instanceof Function ? this.ontogglepause() : null;
		this._playButton = playButton;
	}

	connectedCallback() {
		if (this.children.length) return;

		this.appendChild(this._drawButton);
		this.appendChild(this._playButton);
		this.appendChild(this._stepButton);
		this.appendChild(this._fastForwardButton);
	}

	attributeChangedCallback(attribute) {
		if (attribute === 'running') {
			const isRunning = this.hasAttribute('running');
			this._playButton.icon = isRunning ? 'pause' : 'play';
			this._stepButton.disabled = isRunning;
			this._fastForwardButton.disabled = isRunning;
		}
	}

	set running(flag) {
		if (flag) this.setAttribute('running', '');
		else this.removeAttribute('running');
	}

	get running() {
		return this.hasAttribute('running');
	}
}
