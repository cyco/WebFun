import AbstractActionItem from "./abstract-action-item";

type Instruction = AbstractActionItem & { isInstruction: true };
export default Instruction;
