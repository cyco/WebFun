import GameplayContext from "./gameplay-context";
interface Expectation {
	evaluate(ctx: GameplayContext): void;
}

export default Expectation;
