function BaseEvent(type: string, init: EventInit) {
	const newTarget = this.__proto__.constructor;
	return Reflect.construct(Event, [type, init], newTarget);
}

Object.setPrototypeOf(BaseEvent, Event);
Object.setPrototypeOf(BaseEvent.prototype, Event.prototype);

declare interface BaseEvent extends Event {
	prototype: Event;

	new (): Event;
}

export default BaseEvent as any as typeof Event;
