import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x01;
export const Arguments = 0;
export const Description = "Evalutes to true if hero just entered the zone";
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.state.justEntered;

// TODO: validate against original implementation
/*
 case JUST_ENTERED:
 if ( mode != JustEntered )
 goto condition_NOT_satisfied;
 */
