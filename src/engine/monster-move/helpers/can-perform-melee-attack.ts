import { Point } from "src/util";
import { Monster } from "src/engine/objects";

export default (direction: Point, monster: Monster, hero: Point): boolean => monster.position.byAdding(direction).isEqualTo(hero);
