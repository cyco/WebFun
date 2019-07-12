import { NPC, Zone } from "src/engine/objects";
import { Point } from "src/util";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	// cooldown = &npc_1->facing_direction?;
	// v95 = (char *)npc_1 + 8 * npc_1->facing_direction?;
	// x_11 = *((_DWORD *)v95 + 18);
	// y_14 = *((_DWORD *)v95 + 19);
	// lastDirectionChoice_2 = npc_1->lastDirectionChoice;
	// if ( lastDirectionChoice_2 )
	// {
	// 	yDistance = 0;
	// 	movementCheckResult = 0;
	// 	npc_1->lastDirectionChoice = lastDirectionChoice_2 - 1;
	// }
	// else
	// {
	// 	if ( ((unsigned __int16)((unsigned __int64)*field_B0_ref >> 32) ^ abs(*field_B0_ref) & 1) == (unsigned __int16)((unsigned __int64)*field_B0_ref >> 32) )
	// 	goto no_movement;
	// 	x_6 = npc_1->x;
	// 	x_ref_4 = &npc_1->x;
	// 	if ( x_11 == x_6 )
	// 	movementCheckResult = 0;
	// 	else
	// 	movementCheckResult = x_11 <= x_6 ? -1 : 1;
	// 	y_13 = npc_1->y;
	// 	y_ref_3 = &npc_1->y;
	// 	if ( y_14 == y_13 )
	// 	yDistance = 0;
	// 	else
	// 	yDistance = y_14 <= y_13 ? -1 : 1;
	// 	if ( !movementCheckResult && !yDistance )
	// 	{
	// 	v103 = npc_1->facing_direction? + 1;
	// 	*cooldown = v103;
	// 	if ( v103 > 2 )
	// 		*cooldown = -1;
	// 	}
	// 	if ( movementCheckResult + *x_ref_4 == hero_x_tile && yDistance + *y_ref_3 == hero_y_tile )
	// 	{
	// 	movementCheckResult = 0;
	// 	yDistance = 0;
	// 	if ( char_1->damage >= 0 )
	// 	{
	// 		YodaView::PlaySound(view, SOUND_HURT);
	// 		YodaView::ChangeHealth(view, -char_1->damage);
	// 	}
	// 	}
	// 	if ( Zone::GetTileIdAt(zone, movementCheckResult + *x_ref_4, yDistance + *y_ref_3, OBJECTS) != -1 )
	// 	goto no_movement;
	// 	can_actually_move = 0;
	// 	tile_id_5 = Zone::GetTileIdAt(zone, movementCheckResult + *x_ref_4, yDistance + *y_ref_3, 0);
	// 	if ( tile_id_5 >= 0 && !(BYTE2(YodaDocument::GetTileByID(*document_ref, tile_id_5)->specs) & 1) )
	// 	can_actually_move = 1;
	// 	if ( can_actually_move )
	// 	{
	// 	*x_ref_4 += movementCheckResult;
	// 	*y_ref_3 += yDistance;
	// 	}
	// }
	// goto peform_move;
};
