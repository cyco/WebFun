export const Opcode = 0x01;
export const Arguments = 0;
export const Description = "Evalutes to true if hero just entered the zone";
export default (args, zone, engine) => engine.state.justEntered;

// TODO: validate against original implementation
/*
 case JUST_ENTERED:
 if ( mode != JustEntered )
 goto condition_NOT_satisfied;
 */
