import ZoneScene from "src/engine/scenes/zone-scene";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";

import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x12,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description:
		"Set hero's position to `arg_0`x`arg_1` ignoring impassable tiles. Execute hotspot actions, redraw the current scene and move camera if the hero is not hidden.",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		/*
		 YodaView::RedrawTile(view, document->hero_x / 32, document->hero_y / 32);
		 if ( !view->needs_redraw? ) YodaDocument::RedrawCurrentZone(document);
		 if ( !document->hero_hidden ) goto move_camera_if_necessary;
		 if ( zone->hotspots.count <= 0 ) goto move_camera_if_necessary;

		 v = zone->hotspots.ptrs;
		 v86 = instruction->arg1;
		 break;
		 */

		engine.hero.location.x = instruction.arguments[0];
		engine.hero.location.y = instruction.arguments[1];

		if (engine.hero.visible === false && engine.sceneManager.currentScene instanceof ZoneScene)
			engine.sceneManager.currentScene._executeHotspots();

		// original implementation actually has a hard break here
		return ResultFlags.OK;
	}
};
