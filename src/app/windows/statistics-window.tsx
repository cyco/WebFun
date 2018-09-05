import { PersistentState } from "src/engine";
import { Textbox, Window } from "src/ui/components";
import "./statistics-window.scss";

class StatisticsWindow extends Window {
	public static tagName = "wf-statistics-window";
	public title = "Player Statistics";
	public closable = true;

	private _state: typeof PersistentState = PersistentState;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.content.appendChild(<div className="icon" />);
		this.content.appendChild(
			<ul>
				{this._buildRow("High Score:", "highScore")}
				{this._buildRow("Last Score:", "lastScore")}
				{this._buildRow("Game Won:", "gamesWon")}
				{this._buildRow("Games Lost:", "gamesLost")}
			</ul>
		);
	}

	private _buildRow(name: string, key: string) {
		return (
			<li>
				<span>{name}</span>
				<Textbox
					editable={false}
					align="right"
					width={60}
					height={20}
					value={`${(this._state as any)[key]}`}
				/>
			</li>
		);
	}

	protected disconnectedCallback() {
		this.content.textContent = "";
		super.disconnectedCallback();
	}
}

export default StatisticsWindow;
