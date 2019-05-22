export const global: any = Function("return this")();

if (!global.window) {
	global.window = global;
}

export const {
	setTimeout,
	console,
	parseInt,
	Array,
	ArrayBuffer,
	Promise,
	DataView,
	Uint8Array,
	Uint16Array,
	Uint32Array,
	requestAnimationFrame,
	cancelAnimationFrame,
	performance,
	Error,
	TextDecoder
} = global;
