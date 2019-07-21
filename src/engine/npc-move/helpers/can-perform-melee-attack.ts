import { Point } from "src/util";
import { NPC } from "src/engine/objects";

export default (direction: Point, npc: NPC, hero: Point) => npc.position.byAdding(direction).isEqualTo(hero);
