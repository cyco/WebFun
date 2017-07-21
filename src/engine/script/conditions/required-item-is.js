export const Opcode = 0x0e;
export const Arguments = -1;

export default (args, zone, engine) => {


	return false;
};

// TODO: Validate against original implementation
/*
 case REQUIREDITEM_EQ:
 if ( !document )
 goto condition_NOT_satisfied;
 item_id_1 = condition->arg1;
 v28 = (WorldThing *)((char *)document + 52 * (document->world_x + 10 * document->world_y));
 if ( v28[23].find_item_id == item_id_1 )
 condition_satisfied = 1;
 else
 condition_satisfied = (unsigned int)(v28[23].field_16 - item_id_1) < 1;
 break;
 */
