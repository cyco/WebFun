import { Monster, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import performMove from "./perform-move";

export default (monster: Monster, zone: Zone, engine: Engine, mover = performMove) =>
	mover(monster, new Point(0, 0), false, zone, engine);
