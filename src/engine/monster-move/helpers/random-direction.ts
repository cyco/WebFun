import { randmod, Point } from "src/util";

export default (): Point => new Point(randmod(3) - 1, randmod(3) - 1);
