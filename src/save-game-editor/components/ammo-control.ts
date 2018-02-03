import { Component } from 'src/ui';
import './ammo-control.scss';

class AmmoControl extends Component implements EventListenerObject {
	public static readonly TagName = 'wf-save-game-editor-ammo';
	public static readonly observedAttributes = ['vertical'];
	private _value: number = 1;
	private _bar: HTMLElement = document.createElement('div');
	private _vertical: boolean = false;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._bar);
		this.addEventListener('mousedown', this);
	}

	attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
		this._vertical = this.hasAttribute('vertical');
		this._bar.style.removeProperty('width');
		this._bar.style.removeProperty('height');
		this.value = this._value;
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
		const { left, width, bottom, height } = this.getBoundingClientRect();
		if (this._vertical) {
			this.value = (bottom - clientY) / height;
		} else {
			this.value = (clientX - left) / width;
		}

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

	set value(value: number) {
		this._value = Math.max(Math.min(value, 1), 0);

		const cssValue = `${100 * this.value}%`;
		if (this._vertical) this._bar.style.height = cssValue;
		else this._bar.style.width = cssValue;
	}
}

export default AmmoControl;
