import { Logger as LoggerInterface } from "src/engine";

class Logger implements LoggerInterface {
	constructor(private console: Console) {}

	debug(...args: any[]): void {
		this.console.debug(...args);
	}

	info(...args: any[]): void {
		this.console.info(...args);
	}

	warn(...args: any[]): void {
		this.console.warn(...args);
	}

	error(...args: any[]): void {
		this.console.error(...args);
	}
}

export default Logger;
