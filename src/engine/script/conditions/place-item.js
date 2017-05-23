export const Opcode = 0x03;
export const Arguments = -1;
export default (args, zone, engine) => false;
// TODO: validate against original implementation
/*
case PLACEDITEM_EQ:
	if ( mode != 3 )
	  goto condition_NOT_satisfied;
	if ( condition->arg1 != hero_x )
	  goto condition_NOT_satisfied;
	if ( condition->arg2 != hero_y )
	  goto condition_NOT_satisfied;
	v17 = condition->arg4;
	v18 = v17 == -1 ? document->world_things_1[document->world_x + 10 * document->world_y].find_item_id : (signed int)zone->tile_ids[condition->arg3 + 3 * (hero_x + 18 * hero_y)];
	if ( v18 != v17 && v17 != -1 )
	  goto condition_NOT_satisfied;
	v19 = *(_DWORD *)&condition->arg5;
	if ( v19 == -1 )
	  v19 = document->world_things_1[document->world_x + 10 * document->world_y].required_item_id;
	if ( v19 < 0 || document->tiles.ptrs[v19] != document->goal_tile )
	  goto condition_NOT_satisfied;
	if ( v19 == THE_FORCE )
	  YodaView::Unknown_17(view, *(&document->field_2E44 + 1), *(&document->field_2E44 + 2), -1);
	break;
*/