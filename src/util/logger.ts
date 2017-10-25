import Settings from "src/settings";
import identity from "src/util/identity";
import LogLevel from "./log-level";

class Logger {
	public level = LogLevel.Warning;
	public prefix: string = "";

	public static declare(module: string, enabled = true): Logger {
		const logger = new Logger();
		logger.prefix = `[${module}]`;
		logger.level = enabled ? Settings.logLevel : LogLevel.Off;

		return logger;
	}

	public log(level: LogLevel, ...args: any[]): void {
		if (level < this.level) return;

		const facility = this._pickLoggingFacility(level);
		facility.call(console, this.prefix, ...args);
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
