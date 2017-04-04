import Window from './window';
import Slider from './slider';
import Button from './button';

export default class SettingsWindow extends Window {
	constructor() {
		super();
		
		this.slider = null;
	}

	setupSlider() {
		const slider = new Slider();
		slider.minValue = 0;
		slider.maxValue = 1;
		slider.value = 0.5;

		slider.onchange = (event) => console.log('slider changed', event);

		this.content.appendChild(slider.element);
		this.slider = slider;
	}

	show(container) {
		super.show(container);
		if (this.slider !== null) {
			this.slider.layout();
		}
	}

	setupConfirmationButtons() {
		const self = this;
		const okButton = new Button();
		okButton.title = 'OK';
		okButton.onclick = () => self.close();
		this.element.appendChild(okButton.element);

		const cancelButton = new Button();
		cancelButton.title = 'Cancel';
		cancelButton.onclick = () => self.close();
		this.element.appendChild(cancelButton.element);
	}
}
