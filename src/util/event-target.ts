let globalInstance: EventTarget_not_builtin;

class EventTarget_not_builtin {
	private listeners: { [_: string]: (EventListener | EventListenerObject)[] } = {};

	static addEventListener(type: string, listener: EventListener | EventListenerObject): void {
		globalInstance.addEventListener(type, listener);
	}

	static removeEventListener(type: string, listener: EventListener | EventListenerObject): void {
		globalInstance.removeEventListener(type, listener);
	}

	static dispatchEvent(type: string | Event, detail?: any): void {
		globalInstance.dispatchEvent(type, detail);
	}

	addEventListener(type: string, listener: EventListener | EventListenerObject): void {
		let place = this.listeners[type];
		if (!place) place = this.listeners[type] = [];
		place.splice(0, 0, listener);
	}

	removeEventListener(type: string, listener: EventListener | EventListenerObject): void {
		if (!type) return;

		if (listener) {
			const listeners = this.listeners[type];
			if (!listeners) return;
			const index = listeners.indexOf(listener);
			if (index === -1) return;
			this.listeners[type].splice(index, 1);
		} else delete this.listeners[type];
	}

	dispatchEvent(type: string | Event, detail: any = {}): void {
		detail.target = detail.target || this;

		const event =
			type instanceof Event
				? type
				: new CustomEvent(type, {
						detail: detail
				  });

		(this as any)["on" + type] instanceof Function && (this as any)["on" + type](event);

		let listeners = this.listeners[type instanceof Event ? event.type : type];
		for (let i in listeners) {
			if (!listeners.hasOwnProperty(i)) continue;
			const listener = listeners[i];
			if (listener instanceof Function) {
				listener.call(this, event);
			} else listener.handleEvent(event);
		}

		if (this !== globalInstance) {
			globalInstance.dispatchEvent(type, detail);
		}
	}

	protected registerEvents(events: { [_: string]: string }): void {
		events.each(key => {
			(this as any)["on" + events[key]] = null;
		});
	}
}

globalInstance = new EventTarget_not_builtin();
export default EventTarget_not_builtin;
