import { AbstractWindow, Button } from "src/ui/components";
import { Engine } from "src/engine";
import "./current-status-info.scss";

class CurrentStatusInfo extends AbstractWindow {
	public static readonly tagName = "wf-current-status-info";
	public engine: Engine;

	public constructor() {
		super();
		this.title = "Current Status Info";
	}

	protected connectedCallback(): void {
		const engine = this.engine;
		this.content = (
			<div>
				<div>
					Current Zone is #:&nbsp;&nbsp;<span>{engine.currentZone?.id}</span>
				</div>
				<div className="row">
					<div>
						X:
						<br />
						<span>{engine.hero?.location.x}</span>
					</div>
					<div>
						Y:
						<br />
						<span>{engine.hero?.location.y}</span>
					</div>
					<div>
						E:
						<br />
						<span>{engine.story?.goal?.id}</span>
					</div>
				</div>
				<div>
					<Button label="OK" onclick={() => this.close()}></Button>
				</div>
			</div>
		);

		super.connectedCallback();
	}
}

export default CurrentStatusInfo;
