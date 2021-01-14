import { Component } from "src/ui";
import { Expectation } from "../automation/test";
import { Engine } from "src/engine";
import "./expectation-editor.scss";

class ExpectationEditor extends Component {
	public static readonly tagName = "wf-debug-expection-editor";
	private _expectations: Expectation[] = [];
	private _engine: Engine = null;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.rebuild();
	}

	private rebuild() {
		this.textContent = "";

		this.expectations.forEach(exp => {
			this.appendChild(
				<div>
					{this.buildStatus(exp)} {exp.format()}
				</div>
			);
		});
	}

	private buildStatus(expectation: Expectation): HTMLElement {
		if (!this.engine) {
			return <span>⚪️</span>;
		}

		try {
			this.evaluate(expectation);
			return <span>🟢</span>;
		} catch (e) {
			return <span title={e}>🔴</span>;
		}
	}

	private evaluate(expectation: Expectation): void {
		const fail = (message: string) => {
			throw message;
		};
		const assert = (value: boolean) => value || fail("");
		const expect = (something: any) => {
			return {
				toBe: (expectedValue: any) => assert(something === expectedValue),
				toEqual: (expectedValue: any) => assert(something === expectedValue),
				toBeTrue: () => assert(something === true),
				toBeFalse: () => assert(something === false),
				toBeTruthy: () => assert(!!something),
				toBeFalsy: () => assert(!something)
			};
		};
		const it = (_: string, block: any) => block();

		(window as any).it = it;
		(window as any).expect = expect;
		(window as any).fail = fail;

		expectation.evaluate({ engine: this.engine });

		delete window.expect;
		delete window.it;
		delete window.fail;
	}

	public evaluateExpectations(): void {
		for (let i = 0; i < this.expectations.length; i++) {
			const row = this.children[i];
			const expectation = this.expectations[i];

			row.replaceChild(this.buildStatus(expectation), row.firstElementChild);
		}
	}

	public set expectations(expectations: Expectation[]) {
		this._expectations = expectations ?? [];
		this.rebuild();
	}

	public get expectations(): Expectation[] {
		return this._expectations;
	}

	public set engine(engine: Engine) {
		this._engine = engine;
		this.rebuild();
	}

	public get engine(): Engine {
		return this._engine;
	}
}
export default ExpectationEditor;
