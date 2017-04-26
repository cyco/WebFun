import Button from "./button";

export default class IconButton extends Button {
	constructor(iconName) {
		super();

		this._icon = document.createElement("i");
		this._icon.classList.add('fa');
		this._icon.classList.add('fa-icon');
		this.element.appendChild(this._icon);
		this.element.classList.add('icon-button');
		
		this.iconName = iconName ? iconName : '';
	}
	
	set iconName(iconName) {
		this._icon.className = `fa fa-${iconName}`;
	}
	
	get iconName(){
		return this._icon.className.substr(6);
	}
	
	set title(t) {}

	get title() {
		return '';
	}
}
