import { Component } from "src/ui";
import "./onscreen-button.scss";

const BackgroundSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 80 80"><defs><linearGradient id="a" gradientTransform="rotate(-90 675 -115) scale(.04883)" spreadMethod="pad" x2="819.2" x1="-819.2" gradientUnits="userSpaceOnUse"><stop stop-color="#383838" offset="0"/><stop stop-color="#585858" offset="1"/></linearGradient></defs><path fill="url(#a)" d="M818.25 588.25Q806.55 600 790 600q-16.65 0-28.35-11.75Q750 576.55 750 560t11.65-28.3Q773.35 520 790 520q16.55 0 28.25 11.7Q830 543.45 830 560t-11.75 28.25m-4.05-4.05q10.1-9.95 10.1-24.2 0-14.15-10.1-24.25-9.95-10.05-24.2-10.05t-24.25 10.05Q755.7 545.85 755.7 560q0 14.25 10.05 24.2 10 10.1 24.25 10.1t24.2-10.1" transform="translate(-750 -520)"/><path fill="#383838" d="M64.2 64.2Q54.25 74.3 40 74.3T15.75 64.2Q5.7 54.25 5.7 40q0-14.15 10.05-24.25Q25.75 5.7 40 5.7t24.2 10.05Q74.3 25.85 74.3 40q0 14.25-10.1 24.2"/></svg>`;

const r = (t: string): SVGSVGElement => {
	const d = <div></div>;
	d.innerHTML = t;
	return d.firstElementChild as SVGSVGElement;
};

class OnscreenButton extends Component {
	public static readonly tagName = "wf-onscreen-button";
	protected _background = r(BackgroundSVG);
	private _pressed: boolean = false;
	public label: string;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._background);
		this.appendChild(<label>{this.label}</label>);
		this.addEventListener("touchstart", this);
		this.addEventListener("mousedown", this);
		this.addEventListener("mouseup", this);
		this.addEventListener("touchend", this);
		this.addEventListener("touchcancel", this);
	}

	disconnectedCallback() {
		this.removeEventListener("touchstart", this);
		this.removeEventListener("touchend", this);
		this.removeEventListener("touchcancel", this);
		this.removeEventListener("mousedown", this);
		this.removeEventListener("mouseup", this);
		this.textContent = "";
		super.disconnectedCallback();
	}

	handleEvent(event: TouchEvent) {
		this._pressed = event.type === "touchstart";
		if (event.type === "touchstart" || event.type === "mousedown") this.classList.add("pressed");
		else this.classList.remove("pressed");

		event.preventDefault();
		event.stopPropagation();
	}

	public get pressed() {
		return this._pressed;
	}
}

export default OnscreenButton;
