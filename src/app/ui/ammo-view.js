import { View } from '/ui';

export default class WeaponView extends View {
	constructor(element) {
		super(element);

		this._element.classList.add('ammo-view');

		const background = document.createElement('div');
		background.classList.add('background');
		this.element.appendChild(background);
		this._background = background;

		this._indicator = document.createElement('div');
		this._indicator.classList.add('value');
		this.element.appendChild(this._indicator);
	}

	get ammo() {
		return parseInt(this._indicator.style.height) / 95 || 0;
	}

	set ammo(value) {
		if (value === 0xFF || value === -1) {
			value = 0;
			this._background.style.backgroundColor = '';
		} else this._background.style.backgroundColor = '#000000';

		this._indicator.style.height = ((value > 1 ? 1 : value) * 95) + '%';
	}
}
