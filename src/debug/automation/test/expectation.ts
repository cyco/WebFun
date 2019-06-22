import GameplayContext from "./gameplay-context";
interface Expectation {
	evaluate(ctx: GameplayContext): void;
	format(): string;
}

export default Expectation;
