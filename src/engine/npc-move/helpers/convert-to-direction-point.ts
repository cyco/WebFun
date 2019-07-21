import { Point } from "src/util";

export default (direction: number) => {
	switch (direction) {
		case -1:
			return new Point(0, -1);
		case 0:
			return new Point(0, 1);
		case 1:
			return new Point(1, 0);
		case 2:
			return new Point(-1, 0);
		default:
			return new Point(0, 0);
	}
};
