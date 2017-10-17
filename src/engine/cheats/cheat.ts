import Engine from "../engine";

abstract class Cheat {
	abstract get code(): string;

	abstract get message(): string;

	abstract execute(engine: Engine): void;
}

export default Cheat;
