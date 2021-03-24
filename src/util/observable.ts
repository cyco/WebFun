import EventTarget from "./event-target";
import PropertyChangeEvent from "./property-change-event";

function observable<T extends object>(object: T): T & EventTarget {
	const eventTarget = new EventTarget();

	return new Proxy(object, {
		get(target: T, p: PropertyKey, _: any): any {
			if (p === "addEventListener") return eventTarget.addEventListener.bind(eventTarget);
			if (p === "removeEventListener") return eventTarget.removeEventListener.bind(eventTarget);
			if (p === "dispatchEvent") return eventTarget.dispatchEvent.bind(eventTarget);

			return (target as any)[p];
		},

		set(target: T, p: PropertyKey, value: any, _: any): boolean {
			(target as any)[p] = value;
			eventTarget.dispatchEvent(new PropertyChangeEvent(p, value, target));

			return true;
		}
	}) as any;
}

export default observable;
