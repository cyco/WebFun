import { Health } from "src/app/ui";
import { Point, xy2polar, rad2deg } from "src/util";
import { abs, ceil, sign } from "src/std/math";
import { MouseEvent } from "src/std/dom";
import "./interactive-health.scss";

const FlipThreshold = 180;

class InteractiveHealth extends Health implements EventListenerObject {
	public static readonly tagName = "wf-save-game-editor-health";
	private lastAngle: number = null;

	protected connectedCallback() {
		super.connectedCallback();
		this.addEventListener("mousedown", this);
	}

	handleEvent(event: MouseEvent) {
		if (event.type === "mousedown") {
			document.addEventListener("mouseup", this, { capture: true } as any);
			document.addEventListener("mousemove", this, { capture: true } as any);
		}

		if (event.type === "mouseup") {
			document.removeEventListener("mouseup", this, { capture: true } as any);
			document.removeEventListener("mousemove", this, { capture: true } as any);
		}

		const { left, width, top, height } = this.getBoundingClientRect();
		const center = new Point(left + width / 2, top + height / 2);
		const point = new Point(event.clientX, event.clientY).subtract(center);
		const [_, angle] = xy2polar(point.x, point.y);

		let normangle = rad2deg(360 - angle) % 360;
		let base = ceil(this.health / 100) * 100;
		if (this.lastAngle === null) {
			this.health = base - (normangle / 360) * 100;
			this.lastAngle = normangle;
			return;
		}

		if (this.lastAngle === normangle) {
			return;
		}

		const diff = normangle - this.lastAngle;
		if (abs(diff) > FlipThreshold) {
			base += sign(diff) * 100;
		}

		this.health = base - (normangle / 360) * 100;
		this.lastAngle = normangle;
		this.dispatchEvent(new CustomEvent("change"));
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();

		this.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this, { capture: true } as any);
		document.removeEventListener("mousemove", this, { capture: true } as any);
	}
}

export default InteractiveHealth;
