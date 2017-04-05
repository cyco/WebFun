const LISTENERS = "" + Math.random() + " ";
let globalInstance;

export default class EventTarget {
	static addEventListener(type, listener) {
		globalInstance.addEventListener(type, listener);
	}

	static removeEventListener(type, listener) {
		globalInstance.removeEventListener(type, listener);
	}

	static dispatchEvent(type, detail) {
		globalInstance.dispatchEvent(type, detail);
	}

	constructor() {
		this[LISTENERS] = [];
	}

	addEventListener(type, listener) {
		let place = this[LISTENERS][type];
		if (!place)
			place = this[LISTENERS][type] = [];
		place.splice(0, 0, listener);
	}

	removeEventListener(type, listener) {
		if (!type) return;

		if (listener) {
			const listeners = this[LISTENERS][type];
			if (!listeners) return;
			const index = listeners.indexOf(listener);
			if (index === -1) return;
			this[LISTENERS][type].splice(index, 1);
		} else
			delete this[LISTENERS][type];
	}

	dispatchEvent(type, detail = {}) {
		detail.target = detail.target || this;

		const event = new CustomEvent(type, {
			detail: detail
		});

		if (this["on" + type] && this["on" + type](event) === false)
			return;

		let listeners = this[LISTENERS][type];
		for (let i in listeners) {
			if (!listeners.hasOwnProperty(i)) continue;
			listeners[i].call(this, event);
		}

		if (this !== globalInstance) {
			globalInstance.dispatchEvent(type, detail);
		}
	}

	registerEvents(events) {
		for (let i in events) {
			if (!events.hasOwnProperty(i)) continue;
			this["on" + events[i]] = null;
		}
	}
}

globalInstance = new EventTarget();
