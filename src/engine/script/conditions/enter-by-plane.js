export const Opcode = 0x09;
export const Arguments = 0;
export default (args, zone, engine) => engine.state.enteredByPlane;
// TODO: validate against original implementation
/*
 case ENTERED_BY_PLANE:
	if ( mode != ByPlane )
	  goto condition_NOT_satisfied;
	break;
*/