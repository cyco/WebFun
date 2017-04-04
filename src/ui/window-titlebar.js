import View from './view';
import Menubar from './menubar';
import { identity } from '/util';

export default class extends View {
	constructor(window) {
		super();
		this.element.classList.add('titlebar');

		this._menubar = null;
		this._titleNode = null;

		this._closeButton = new View();
		this._closeButton.classList.add('close-button');
		this._closeButton.element.onclick = () => {
			window.element.remove();
			this.onclose();
		};
		this.addSubview(this._closeButton);

		this._setupDragging(window);

		this.onclose = identity;
	}

	_setupDragging(win) {
		let dragLocation;
		const mouseMove = (event) => {
			win.x = event.clientX - dragLocation.x;
			win.y = event.clientY - dragLocation.y;
		};

		const mouseUp = () => {
			window.removeEventListener('mouseup', mouseUp);
			window.removeEventListener('mousemove', mouseMove);
		};

		const mouseDown = (event) => {
			if (event.target !== this.element) return;
			dragLocation = {
				x: event.clientX - win.x,
				y: event.clientY - win.y
			};
			window.addEventListener('mouseup', mouseUp);
			window.addEventListener('mousemove', mouseMove);
		};

		this.element.addEventListener('mousedown', mouseDown);
	}

	set menu(m) {
		if (this._menubar) {
			this._menubar.element.remove();
			this._menubar = null;
		}

		if (m) {
			this._menubar = new Menubar(m);
			this.element.appendChild(this._menubar.element);
		}

		if (this._menubar && this._titleNode) {
			this._titleNode.style.display = this._menubar ? 'none' : '';
		}
	}

	get menu() {
		return this._menu;
	}

	set title(t) {
		if (this._titleNode) {
			this._titleNode.remove();
			this._titleNode = null;
		}

		if (t) {
			if (this._menu) {
				this._titleNode.style.display = 'none';
			}

			this._titleNode = document.createElement('span');
			this._titleNode.innerText = t;
			this.element.insertBefore(this._titleNode, null);
		}
	}

	get title() {
		return this._titleNode.innerText;
	}

	set closable(flag) {
		this._closeButton.style.display = flag ? '' : 'none';
	}

	get closable() {
		return this._closeButton.style.display !== 'none';
	}
}
