import "./interactive-health.scss";

import { Point, rad2deg, xy2polar } from "src/util";
import { abs, ceil, sign } from "src/std/math";

import { AbstractHealth } from "src/app/webfun/ui";

const FlipThreshold = 180;

class InteractiveHealth extends AbstractHealth implements EventListenerObject {
	public static readonly tagName = "wf-save-game-editor-health";
	private lastAngle: number = null;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener("mousedown", this);
	}

	handleEvent(event: MouseEvent): void {
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
		const [, angle] = xy2polar(point.x, point.y);

		const normAngle = rad2deg(360 - angle) % 360;
		let base = ceil(this.health / 100) * 100;
		if (this.lastAngle === null) {
			this.health = base - (normAngle / 360) * 100;
			this.lastAngle = normAngle;
			return;
		}

		if (this.lastAngle === normAngle) {
			return;
		}

		const diff = normAngle - this.lastAngle;
		if (abs(diff) > FlipThreshold) {
			base += sign(diff) * 100;
		}

		this.health = base - (normAngle / 360) * 100;
		this.lastAngle = normAngle;
		this.dispatchEvent(new CustomEvent("change"));
	}

	protected disconnectedCallback(): void {
		super.disconnectedCallback();

		this.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this, { capture: true } as any);
		document.removeEventListener("mousemove", this, { capture: true } as any);
	}
}

export default InteractiveHealth;
