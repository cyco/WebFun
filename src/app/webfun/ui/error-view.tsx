import "./error-view.scss";
import { Component } from "src/ui";

import FileFormatParseError from "src/engine/file-format/parse-error";
import WorldGenerationError from "src/engine/generation/world-generation-error";

class ErrorView extends Component {
	public static readonly tagName = "wf-error-view";
	private _error: Error;

	connectedCallback(): void {
		this.presentError();
		super.disconnectedCallback();
	}

	disconnectedCallback(): void {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private presentError(): void {
		if (!this.isConnected) return;
		this.textContent = "";
		if (!this._error) return;

		this.appendChild(<h1>Oh, no!</h1>);

		if (this._error instanceof WorldGenerationError) {
			const { seed, planet, size } = this._error;
			this.appendChild(<h2>Something went wrong while generating the new world.</h2>);
			this.appendChild(
				<div>
					<label>Details</label>
					<div>
						{this._error.message}
						<br />
						While generating a <i>{size.name}</i> world on <i>{planet.name}</i> with seed{" "}
						<i>{seed.toHex(4)}</i>
					</div>
				</div>
			);
			return;
		}

		if (this._error instanceof FileFormatParseError) {
			this.appendChild(<h2>Something went wrong while reading the game file..</h2>);
			return;
		}

		this.appendChild(<h2>An unknown error occured</h2>);
		this.appendChild(
			<div>
				<label>Details</label>
				<div>{this._error.message ?? this._error}</div>
			</div>
		);
	}

	set error(error: Error) {
		console.error(error);
		this._error = error;
		this.presentError();
	}

	get error(): Error {
		return this._error;
	}
}

export default ErrorView;
