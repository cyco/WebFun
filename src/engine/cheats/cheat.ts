import Engine from "../engine";

abstract class Cheat {
	abstract execute(engine: Engine): void;

	abstract get code(): string;

	abstract get message(): string;
}

export default Cheat;
