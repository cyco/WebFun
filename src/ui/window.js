import View from './view';
import WindowTitlebar from './window-titlebar';

export default class extends View {
	constructor() {
		super();

		this.element.classList.add('window');
		this.x = 0;
		this.y = 0;

		this._titlebar = new WindowTitlebar(this);
		this.element.appendChild(this._titlebar.element);

		this._content = new View();
		this._content.element.classList.add('content');
		this.element.appendChild(this._content.element);
	}

	set menu(menu) {
		this._titlebar.menu = menu;
	}

	get menu() {
		return this._titlebar.menu;
	}

	set closable(flag) {
		this._titlebar.closable = flag;
	}

	get closable() {
		return this._titlebar.closable;
	}

	set title(t) {
		this._titlebar.title = t;
	}

	get title() {
		return this._titlebar.title;
	}

	get content() {
		return this._content.element;
	}

	center() {
		const windowWidth = window.document.documentElement.clientWidth;
		const windowHeight = window.document.documentElement.clientHeight;

		const style = window.getComputedStyle(this._element);
		this.x = (windowWidth - parseFloat(style.width)) / 2.0;
		this.y = (windowHeight - parseFloat(style.height)) / 2.0;
	}

	set x(x) {
		this.element.style.left = `${x}px`;
	}

	get x() {
		return parseFloat(this.element.style.left);
	}

	set y(y) {
		this.element.style.top = `${y}px`;
	}

	get y() {
		return parseFloat(this.element.style.top);
	}

	set onclose(cb) {
		this._titlebar.onclose = cb;
	}

	get onclose() {
		return this._titlebar.onclose;
	}
}
