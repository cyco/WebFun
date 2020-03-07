import { Component } from "src/ui";
import { MIN_VALUE, MAX_VALUE } from "src/std/math";
import "./fullscreen-lock.scss";
import { rgba } from "src/util";

class FullscreenLock extends Component implements EventListenerObject {
	public static readonly tagName = "wf-fullscreen-lock";
	private info: any;
	private orientation: "portait" | "landscape" | null = null;
	private minHeight: number = MAX_VALUE;
	private maxHeight: number = MIN_VALUE;
	private scrollAtBottom: boolean;
	private bottomBarFound: boolean;
	private noBottomBar: boolean;

	public connectedCallback() {
		super.connectedCallback();

		document.addEventListener("scroll", this);
		window.addEventListener("resize", this);

		this.resetHeights();
		this.orientation = this.getOrientation();
		this.updateHeights();
	}

	public handleEvent(event: Event) {
		if (event.type === "resize") {
			const currentOrientation = this.getOrientation();
			if (this.orientation !== currentOrientation) {
				this.orientation = currentOrientation;
				this.resetHeights();
			}
		}
		this.updateHeights();

		this.info = {
			scroll: window.scrollY,
			viewHeight: window.innerHeight,
			body: document.body.offsetHeight
		};

		this.scrollAtBottom = this.info.scroll + this.info.viewHeight === this.info.body;
		this.bottomBarFound = this.maxHeight !== this.minHeight;
		this.noBottomBar = this.bottomBarFound && this.info.viewHeight === this.maxHeight;

		this.removeEventListener("touchmove", this);
		if (!this.noBottomBar) return;
		this.addEventListener("touchmove", this);
		this.style.background = rgba(255, 0, 0, 0.02);
	}

	private resetHeights() {
		this.minHeight = MAX_VALUE;
		this.maxHeight = MIN_VALUE;
	}

	private updateHeights() {
		const height = window.innerHeight;
		this.minHeight = this.minHeight < height ? this.minHeight : height;
		this.maxHeight = this.maxHeight > height ? this.maxHeight : height;
	}

	public disconnectedCallback() {
		document.removeEventListener("scroll", this);
		window.removeEventListener("resize", this);
		this.removeEventListener("touchmove", this);

		super.disconnectedCallback();
	}

	private getOrientation() {
		const isPortrait = !!matchMedia("(orientation: portrait)").matches;
		const isLandscape = !!matchMedia("(orientation: landscape)").matches;
		return isPortrait ? "portait" : isLandscape ? "landscape" : null;
	}
}

export default FullscreenLock;
