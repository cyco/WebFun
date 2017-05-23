import ZoneScene from "/engine/scenes/zone-scene";
import * as Result from "../result";

export const Opcode = 0x12;
export const Arguments = 2;
export default (instruction, engine, action) => {
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
	return Result.OK;
};
