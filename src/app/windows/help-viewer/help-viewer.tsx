import "./help-viewer.scss";
import { AbstractWindow, Button, ProgressIndicator } from "src/ui/components";
import { HelpdecoModule } from "./helpdeco";
import { FileLoader, Point } from "src/util";

const TopicTag = "helpdeco-topic";
const TitleTag = "helpdeco-title";

class HelpViewer extends AbstractWindow {
	public static readonly tagName = "wf-help-viewer";
	private history: number[] = [];
	private topicCount: number = 0;
	private currentTopic: number = 0;
	private helpdeco: HelpdecoModule;

	constructor() {
		super();

		this.closable = true;
		this.title = "Help Viewer";
		this.origin = new Point(20, 20);
		this.autosaveName = "help-viewer-window";

		this.content = (
			<div>
				<div className="action-bar"></div>
				<div className="help-contents">
					<ProgressIndicator></ProgressIndicator>
				</div>
			</div>
		);
	}

	public async loadHelpFile(source: string): Promise<void> {
		this.history = [];
		this.topicCount = 0;
		this.currentTopic = 0;
		this.updateActionBar();
		const hc = this.querySelector(".help-contents") as HTMLElement;
		hc.textContent = "";
		hc.appendChild(<ProgressIndicator></ProgressIndicator>);

		if (!this.helpdeco) {
			const module = (await import("./helpdeco.js")) as any;
			this.helpdeco = await module({
				locateFile: (path: string) => "assets/" + path
			});
		}
		const stream = await FileLoader.loadAsStream(source);
		hc.innerHTML = this.helpdeco.render(stream.buffer, source.split(".").last());
		this.topicCount = this.getElementsByTagName(TopicTag).length;
		this.history = [0];
		this.title = this.querySelector(TitleTag).textContent;
		this.showTopic(0);
	}

	private showTopic(nextTopic: number) {
		const nextTopicElement = this.querySelector(
			`.help-contents ${TopicTag}[id="topic-${nextTopic + 1}"]`
		) as HTMLElement;
		if (!nextTopicElement) {
			return;
		}
		this.currentTopic = nextTopic;
		this.getElementsByTagName(TopicTag).forEach((hp: HTMLElement) => (hp.style.display = "none"));
		nextTopicElement.style.display = "";
		this.updateActionBar();
	}

	public visitTopic(topic: number): void {
		if (topic < 0) return;
		if (topic > this.topicCount - 1) return;
		if (topic === this.currentTopic) return;

		this.history.push(topic);
		this.showTopic(topic);
	}

	public visitLastTopic(): void {
		this.history.pop();
		const topic = this.history.pop() ?? 0;
		this.visitTopic(topic);
	}

	private updateActionBar(): void {
		this.querySelector(".action-bar").replaceWith(
			<div className="action-bar">
				<Button disabled={true}>Contents</Button>
				<Button disabled={true}>Search</Button>
				<Button disabled={this.history.length <= 1} onclick={() => this.visitLastTopic()}>
					Back
				</Button>
				<Button
					disabled={this.currentTopic <= 0}
					onclick={() => this.visitTopic(this.currentTopic - 1)}>
					&lt;&lt;
				</Button>
				<Button
					disabled={this.currentTopic >= this.topicCount - 1}
					onclick={() => this.visitTopic(this.currentTopic + 1)}>
					&gt;&gt;
				</Button>
			</div>
		);
	}
}

export default HelpViewer;
