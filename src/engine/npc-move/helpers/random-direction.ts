import { randmod, Point } from "src/util";

export default () => new Point(randmod(3) - 1, randmod(3) - 1);
