import { PersistentState } from "src/engine";
import { Textbox, Window } from "src/ui/components";
import "./statistics-window.scss";

class StatisticsWindow extends Window {
	public static tagName = "wf-statistics-window";

	private _state: PersistentState;
	private icon: HTMLDivElement;
	private _list: HTMLUListElement;

	protected connectedCallback(): void {
		super.connectedCallback();

		this._setupWindow();
		this.title = "Player Statistics";
	}

	_setupWindow() {
		this.closable = true;

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

	_addRow(name: string, key: string) {
		const label = document.createElement("span");
		label.textContent = name;

		const textbox = <Textbox>document.createElement(Textbox.tagName);
		textbox.editable = false;
		textbox.align = "right";
		textbox.width = 60;
		textbox.height = 20;
		textbox.value = `${this._state[key]}`;

		const row = document.createElement("li");
		row.appendChild(label);
		row.appendChild(textbox);

		this._list.appendChild(row);
	}
}

export default StatisticsWindow;
