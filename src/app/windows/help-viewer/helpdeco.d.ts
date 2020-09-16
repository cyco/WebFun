/// <reference types="emscripten" />

export interface HelpdecoModule extends EmscriptenModule {
	getVersion(): string;
	render(data: Uint8Array|ArrayBuffer|SharedArrayBuffer, fileName: string): string;
}

declare const helpdeco: HelpdecoModule;
export = helpdeco;
