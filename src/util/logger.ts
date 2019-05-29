import LogLevel from "./log-level";
import identity from "src/util/identity";
import { console } from "src/std";

class Logger {
	public level = LogLevel.Warning;
	public prefix: string = null;

	public log(level: LogLevel, ...args: any[]): void {
		if (level < this.level) return;

		const facility = this._pickLoggingFacility(level);
		if (this.prefix) facility.call(console, this.prefix, ...args);
		else facility.call(console, ...args);
	}

	public off(...args: any[]): void {
		this.log(LogLevel.Off, ...args);
	}

	public debug(...args: any[]): void {
		this.log(LogLevel.Debug, ...args);
	}

	public info(...args: any[]): void {
		this.log(LogLevel.Info, ...args);
	}

	public warn(...args: any[]): void {
		this.log(LogLevel.Warning, ...args);
	}

	public error(...args: any[]): void {
		this.log(LogLevel.Error, ...args);
	}

	private _pickLoggingFacility(level: LogLevel) {
		switch (level) {
			case LogLevel.Off:
				return identity;
			case LogLevel.Warning:
				return console.warn;
			case LogLevel.Error:
				return console.error;
			default:
				return console.log;
		}
	}
}

export default Logger;
