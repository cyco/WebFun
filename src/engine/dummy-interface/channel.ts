import { Channel } from "../audio";

class DummyChannel extends Channel<any> {
	playSound(_: any): void {}

	stop(): void {}
}
export default DummyChannel;
