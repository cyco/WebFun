import AbstractInspector from "./abstract-inspector";
import { InlineSelector, ProgressIndicator } from "src/ui/components";
import "./coverage-inspector.scss";
import { SourceLevelCoverage, SymbolicCoverage } from "../components";

enum ViewMode {
	SourceLevel,
	Symbolic
}

const ViewModeStateKey = "view-mode";
class CoverageInspector extends AbstractInspector {
	private covergeLoaded: boolean = false;
	private _sourceLevelCoverage: SourceLevelCoverage = (<SourceLevelCoverage />) as SourceLevelCoverage;
	private _symbolicCoverage: SymbolicCoverage = (<SymbolicCoverage />) as SymbolicCoverage;
	private _viewModeSelector = (
		<InlineSelector
			options={[
				{
					label: "Source level",
					value: ViewMode.SourceLevel
				},
				{
					label: "By symbol",
					value: ViewMode.Symbolic
				}
			]}
			onchange={() => this.build()}
		/>
	) as InlineSelector<ViewMode>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Coverage";
		this.window.autosaveName = "coverage-inspector";
		this.window.content.style.height = "604px";
		this.window.content.style.flexDirection = "column";
		this.window.classList.add("wf-coverage-inspector");
		this.window.addTitlebarButton(this._viewModeSelector);

		this._sourceLevelCoverage.state = state.prefixedWith("source-level");
		this._symbolicCoverage.state = state.prefixedWith("symbolic");
		this._viewModeSelector.value =
			(+state.load(ViewModeStateKey) as ViewMode) || this._viewModeSelector.options[0].value;
	}

	public async build() {
		if (!this.covergeLoaded) {
			this.window.content.textContent = "";
			this.window.content.appendChild(<ProgressIndicator />);

			const coverage = JSON.parse(await this.loadCoverage());
			this._sourceLevelCoverage.data = this.data;
			this._sourceLevelCoverage.coverage = coverage;

			this._symbolicCoverage.data = this.data;
			this._symbolicCoverage.coverage = coverage;

			this.covergeLoaded = true;
			this.build();
		} else {
			this.state.store(ViewModeStateKey, this._viewModeSelector.value);
			this.window.content.textContent = "";
			this.window.content.appendChild(this.currentView);
		}
	}

	private get currentView(): Element {
		switch (this._viewModeSelector.value) {
			case ViewMode.SourceLevel:
				return this._sourceLevelCoverage;
			case ViewMode.Symbolic:
				return this._symbolicCoverage;
		}
	}

	private async loadCoverage(): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new XMLHttpRequest();
			reader.open("GET", "assets/ingame-coverage.json");
			reader.onload = _ => resolve(reader.response);
			reader.onerror = event => reject(event);
			reader.send(void 0);
		});
	}
}

export default CoverageInspector;
