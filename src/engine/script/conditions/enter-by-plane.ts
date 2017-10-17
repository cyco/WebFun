import Zone from "../../objects/zone";
import Engine from "../../engine";
import { int16 } from "../arguments";

export const Opcode = 0x09;
export const Arguments = 0;
export default (args: int16[], zone: Zone, engine: Engine): boolean => engine.state.enteredByPlane;
