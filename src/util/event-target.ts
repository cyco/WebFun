let globalInstance: EventTarget;

class EventTarget {
	private listeners: {[_: string]: Function[]} = {};

	static addEventListener(type: string, listener: Function): void {
		globalInstance.addEventListener(type, listener);
	}

	static removeEventListener(type: string, listener: Function): void {
		globalInstance.removeEventListener(type, listener);
	}

	static dispatchEvent(type: string|Event, detail?: any): void {
		globalInstance.dispatchEvent(type, detail);
	}

	addEventListener(type: string, listener: Function): void {
		let place = this.listeners[type];
		if (!place)
			place = this.listeners[type] = [];
		place.splice(0, 0, listener);
	}

	removeEventListener(type: string, listener: Function): void {
		if (!type) return;

		if (listener) {
			const listeners = this.listeners[type];
			if (!listeners) return;
			const index = listeners.indexOf(listener);
			if (index === -1) return;
			this.listeners[type].splice(index, 1);
		} else
			delete this.listeners[type];
	}

	dispatchEvent(type: string|Event, detail: any = {}): void {
		detail.target = detail.target || this;

		const event = type instanceof Event ? type : new CustomEvent(type, {
			detail: detail
		});

		if ((<any>this)["on" + type] instanceof Function && (<any>this)["on" + type](event) === false)
			return;

		let listeners = this.listeners[type instanceof Event ? event.type : type];
		for (let i in listeners) {
			if (!listeners.hasOwnProperty(i)) continue;
			listeners[i].call(this, event);
		}

		if (this !== globalInstance) {
			globalInstance.dispatchEvent(type, detail);
		}
	}

	protected registerEvents(events: {[_: string]: string}): void {
		for (let i in events) {
			if (!events.hasOwnProperty(i)) continue;
			(<any>this)["on" + events[i]] = null;
		}
	}
}

globalInstance = new EventTarget();
export default EventTarget;
