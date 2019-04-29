const eventMatchers = {
	HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};

const defaultOptions = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
};

function extend(destination, source) {
	for (const property in source) {
		destination[property] = source[property];
	}
	return destination;
}

// found at http://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
function simulateEvent(element, eventName) {
	const options = extend(defaultOptions, arguments[2] || {});
	let oEvent,
		eventType = null;

	for (const name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) {
			eventType = name;
			break;
		}
	}

	if (!eventType) throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType === "HTMLEvents") {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		} else {
			oEvent.initMouseEvent(
				eventName,
				options.bubbles,
				options.cancelable,
				document.defaultView,
				options.button,
				options.pointerX,
				options.pointerY,
				options.pointerX,
				options.pointerY,
				options.ctrlKey,
				options.altKey,
				options.shiftKey,
				options.metaKey,
				options.button,
				element
			);
		}
		element.dispatchEvent(oEvent);
	} else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		const evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent("on" + eventName, oEvent);
	}
	return element;
}

export default simulateEvent;
