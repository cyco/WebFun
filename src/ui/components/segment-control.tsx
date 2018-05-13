import Component from "../component";
import Segment from "./segment";
import "./segment-control.scss";

class SegmentControl extends Component implements EventListenerObject {
	public static readonly tagName = "wf-segmented-control";
	private _currentSegment: Element;
	public onsegmentchange: ((segment: Segment) => void);

	protected connectedCallback() {
		super.connectedCallback();
		Array.from(this.children).forEach(c => c.addEventListener("click", this));
		this.currentSegment = this.querySelector("[selected]");
	}

	handleEvent(e: Event) {
		this.currentSegment = e.currentTarget as Element;
	}

	protected disconnectedCallback() {
		Array.from(this.children).forEach(c => c.removeEventListener("click", this));
		super.disconnectedCallback();
	}

	set currentSegment(s: Element) {
		if (s === this._currentSegment) return;

		if (this._currentSegment) {
			this._currentSegment.removeAttribute("selected");
		}

		this._currentSegment = s;

		if (this._currentSegment) {
			this._currentSegment.setAttribute("selected", "");
		}

		if (this.onsegmentchange instanceof Function)
			this.onsegmentchange(this._currentSegment as Segment);
	}
}

export default SegmentControl;
