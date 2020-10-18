import Component from "../component";
import Group from "./radio-group";

export { Group };

class RadioButton extends Component {
	public static readonly Group = Group;
	public static readonly tagName = "wf-radio-button";
	private _id = String.UUID();
	private _radio = (<input type="radio" id={this._id} />) as HTMLInputElement;
	private _label = (<label htmlFor={this._id} />);

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._radio);
		this.appendChild(this._label);
	}

	protected disconnectedCallback(): void {
		this._label.remove();
		this._radio.remove();

		super.disconnectedCallback();
	}

	get title(): string {
		return this._label.textContent;
	}

	set title(t: string) {
		this._label.textContent = t;
	}

	get checked(): boolean {
		return this._radio.hasAttribute("checked");
	}

	set checked(c: boolean) {
		if (c) this._radio.setAttribute("checked", "");
		else this._radio.removeAttribute("checked");
	}

	get onchange(): (_: Event) => void {
		return this._radio.onchange;
	}

	set onchange(f: (_: Event) => void) {
		this._radio.onchange = f;
	}

	get groupID(): string {
		return this._radio.name;
	}

	set groupID(id: string) {
		this._radio.name = id;
	}
}

export default RadioButton;
