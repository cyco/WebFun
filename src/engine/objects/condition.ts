import AbstractActionItem from "./abstract-action-item";

type Condition = AbstractActionItem & { isCondition: true };
export default Condition;
