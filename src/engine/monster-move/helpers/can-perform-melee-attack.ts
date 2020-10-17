import { Point } from "src/util";
import { Monster } from "src/engine/objects";

export default (direction: Point, monster: Monster, hero: Point) => monster.position.byAdding(direction).isEqualTo(hero);
