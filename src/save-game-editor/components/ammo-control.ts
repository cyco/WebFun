import { Component } from 'src/ui';
import './ammo-control.scss';

class AmmoControl extends Component implements EventListenerObject {
	public static readonly TagName = 'wf-save-game-editor-ammo';
	private _value: number = 1;
	private _bar: HTMLElement = document.createElement('div');

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._bar);
		this.addEventListener('mousedown', this);
	}

	handleEvent(event: MouseEvent) {
		if (event.type === 'mouseup') {
			document.removeEventListener('mousemove', this, <any>{ capture: true });
		}

		if (event.type === 'mousedown') {
			document.addEventListener('mousemove', this, <any>{ capture: true });
			document.addEventListener('mouseup', this, <any>{ once: true, capture: true });
		}

		const { clientX, clientY } = event;
		const { left, width } = this.getBoundingClientRect();

		this.value = Math.max(Math.min((clientX - left) / width, 1), 0);

		event.stopPropagation();
		event.preventDefault();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.removeEventListener('mouseup', this);
		document.removeEventListener('mousemove', this, <any>{ capture: true });
		document.removeEventListener('mouseup', this, <any>{ once: true, capture: true });
	}

	get value() {
		return this._value;
	}

	set value(v: number) {
		this._value = v;
		this._bar.style.width = `${100 * this.value}%`;
	}
}

export default AmmoControl;
