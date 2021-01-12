import "./segment-control.scss";

import Component from "../component";
import { DiscardingStorage } from "src/util";
import Segment from "./segment";

class SegmentControl extends Component implements EventListenerObject {
	public static readonly tagName = "wf-segmented-control";
	private _currentSegment: Element;
	public onsegmentchange: (segment: Segment) => void;
	public state: Storage = new DiscardingStorage();

	protected connectedCallback(): void {
		super.connectedCallback();
		Array.from(this.children).forEach(c => c.addEventListener("click", this));
		this.currentSegment =
			Array.from(this.children).find(c => c.hasAttribute("selected")) ||
			((this.childNodes[this.state.load("active-segment")] || this.firstElementChild) as Segment);
	}

	handleEvent(e: Event): void {
		this.currentSegment = e.currentTarget as Element;
	}

	protected disconnectedCallback(): void {
		Array.from(this.children).forEach(c => c.removeEventListener("click", this));
		super.disconnectedCallback();
	}

	set currentSegment(s: Element) {
		if (s === this._currentSegment) return;

		if (this._currentSegment) {
			this._currentSegment.removeAttribute("selected");
		}

		this._currentSegment = s;
		this.state.store("active-segment", this.childNodes.indexOf(s));

		if (this._currentSegment) {
			this._currentSegment.setAttribute("selected", "");
		}

		if (this.onsegmentchange instanceof Function)
			this.onsegmentchange(this._currentSegment as Segment);
	}
}

export default SegmentControl;
