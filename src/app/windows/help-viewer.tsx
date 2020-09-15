import "./help-viewer.scss";
import { AbstractWindow, Button, ProgressIndicator } from "src/ui/components";

class HelpViewer extends AbstractWindow {
	public static readonly tagName = "wf-help-viewer";
	autosaveName = "help-viewer-window";
	closeable = true;
	title = "Help Viewer";

	constructor() {
		super();

		this.content = (
			<div>
				<div className="action-bar">
					<Button disabled={true}>Contents</Button>
					<Button disabled={true}>Search</Button>
					<Button disabled={true}>Back</Button>
					<Button disabled={true}>&lt;&lt;</Button>
					<Button disabled={true}>&gt;&gt;</Button>
				</div>
				<div className="help-contents">
					<ProgressIndicator></ProgressIndicator>
				</div>
			</div>
		);
	}

	public async loadHelpFile(source: string) {}
}

export default HelpViewer;
