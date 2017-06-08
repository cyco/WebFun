import { Window } from '/ui/components';
import { Textbox } from "/ui";
import { PersistentState } from "/engine";
import "./statistics-window.scss";

export default class extends Window {
	static get TagName(){
		return 'wf-statistics-window';
	}
	
	connectedCallback(){
		super.connectedCallback();

		this._setupWindow();
		this.title = "Player Statistics";
	}

	_setupWindow() {
		this.closable = true;

		this.contentWidth = 200;

		this._state = new PersistentState();

		this.icon = document.createElement("div");
		this.icon.classList.add("icon");
		this.content.appendChild(this.icon);

		this._list = document.createElement("ul");
		this._addRow("High Score:", "highScore");
		this._addRow("Last Score:", "lastScore");
		this._addRow("Game Won:", "gamesWon");
		this._addRow("Games Lost:", "gamesLost");
		this.content.appendChild(this._list);
	}

	_addRow(name, key) {
		const label = document.createElement("span");
		label.append(name);

		const textbox = new Textbox();
		textbox.editable = false;
		textbox.align = "right";
		textbox.width = 60;
		textbox.height = 20;
		textbox.value = this._state[key];
		/* textbox.editable = !WebFun.DEBUG;

		if (WebFun.DEBUG) {
			const self = this;
			textbox.onchange = () => self._state[key] = textbox.value;
		}
		*/

		const row = document.createElement("li");
		row.appendChild(label);
		row.appendChild(textbox.element);

		this._list.appendChild(row);
	}
}
