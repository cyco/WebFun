import { Point } from "src/util";

const offsetIn = function(node: HTMLElement): Point {
	if (this.target === node) {
		return new Point(this.offsetX, this.offsetY);
	}

	const rect = node.getBoundingClientRect();
	return new Point(this.clientX - rect.left, this.clientY - rect.top);
};

MouseEvent.prototype.offsetIn = MouseEvent.prototype.offsetIn || offsetIn;

declare global {
	interface MouseEvent {
		offsetIn(node: HTMLElement): Point;
	}
}

export default offsetIn;
