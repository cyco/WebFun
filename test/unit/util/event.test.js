import Event from "src/util/event";
import { Event as DOMEvent } from "src/std/dom";

describe("WebFun.Util.Event", () => {
	it("Allows for creation of custom event classes", () => {
		const myCustomEvent = new (class extends Event {
			constructor() {
				super("test");
			}
		})();

		expect(myCustomEvent).toBeInstanceOf(DOMEvent);
		expect(myCustomEvent.type).toBe("test");
	});
});
