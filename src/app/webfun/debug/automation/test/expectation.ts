import { Engine } from "src/engine";

interface EngineRef {
	engine: Engine;
}

interface Expectation {
	evaluate(engine: EngineRef): void;
	format(): string;
}

export { EngineRef };
export default Expectation;
