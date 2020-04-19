import { Component } from "src/ui";
import "./onscreen-button.scss";
import { Point } from "src/util";

const BackgroundSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 80 80"><defs><linearGradient id="a" gradientTransform="rotate(-90 675 -115) scale(.04883)" spreadMethod="pad" x2="819.2" x1="-819.2" gradientUnits="userSpaceOnUse"><stop stop-color="#6d6d6d" offset="0"/><stop stop-color="#6d6d6d" offset="1"/></linearGradient></defs><path fill="url(#a)" d="M818.25 588.25Q806.55 600 790 600q-16.65 0-28.35-11.75Q750 576.55 750 560t11.65-28.3Q773.35 520 790 520q16.55 0 28.25 11.7Q830 543.45 830 560t-11.75 28.25m-4.05-4.05q10.1-9.95 10.1-24.2 0-14.15-10.1-24.25-9.95-10.05-24.2-10.05t-24.25 10.05Q755.7 545.85 755.7 560q0 14.25 10.05 24.2 10 10.1 24.25 10.1t24.2-10.1" transform="translate(-750 -520)"/><path fill="#cac6bc" d="M64.2 64.2Q54.25 74.3 40 74.3T15.75 64.2Q5.7 54.25 5.7 40q0-14.15 10.05-24.25Q25.75 5.7 40 5.7t24.2 10.05Q74.3 25.85 74.3 40q0 14.25-10.1 24.2"/></svg>`;

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
	public state: Storage = localStorage.prefixedWith("onscreeen");
	private dragging = false;
	private offset: Point;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._background);

		this.applyState();

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

		if (this.closest(".edit")) {
			if (event.type === "touchstart" || event.type === "mousedown") {
				const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];
				const { left, top } = this.getBoundingClientRect();
				this.offset = new Point(left - clientX, top - clientY);
				this.dragging = true;
				document.addEventListener("touchmove", this);
				document.addEventListener("mousemove", this);
				document.addEventListener("touchmove", this);
				document.addEventListener("mouseup", this);
				document.addEventListener("touchend", this);
			} else if (event.type === "mouseup" || event.type === "touchend") {
				this.dragging = false;
				this.offset = null;
				document.removeEventListener("mousemove", this);
				document.removeEventListener("touchmove", this);
				document.removeEventListener("mouseup", this);
				document.removeEventListener("touchend", this);

				const { top, left, bottom, right } = this.getBoundingClientRect();
				const {
					top: pTop,
					left: pLeft,
					bottom: pBottom,
					right: pRight,
					width,
					height
				} = this.closest(".edit").getBoundingClientRect();

				const le = (left - pLeft) / width;
				const ri = (pRight - right) / width;

				const bo = (pBottom - bottom) / height;
				const to = (top - pTop) / height;

				this.style.left = le < ri ? `${le * 100}%` : ``;
				this.style.right = ri < le ? `${ri * 100}%` : ``;
				this.style.bottom = bo < to ? `${bo * 100}%` : ``;
				this.style.top = to < bo ? `${to * 100}%` : ``;

				this.storeState();
			} else {
				const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];

				this.style.left = `${this.offset.x + clientX}px`;
				this.style.top = `${this.offset.y + clientY}px`;
				this.style.right = "";
				this.style.bottom = "";
			}
		}

		event.preventDefault();
		event.stopPropagation();
	}

	private applyState() {
		const { top, left, bottom, right } = this.state.load(this.id) || {};
		this.style.top = top;
		this.style.left = left;
		this.style.bottom = bottom;
		this.style.right = right;
	}

	private storeState() {
		const { top, left, bottom, right } = this.style;
		this.state.store(this.id, { top, left, bottom, right });
	}

	public get pressed() {
		return this._pressed;
	}
}

export default OnscreenButton;
