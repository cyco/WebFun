import { AbstractWindow, Button } from "src/ui/components";
import "./about-window.scss";

class AboutWindow extends AbstractWindow {
	public static readonly tagName = "wf-about-window";

	constructor() {
		super();

		this.title = "About";

		this.content.append(
			<h1>WebFun</h1>,
			<div className="version">{process.env.VERSION}</div>,
			<a className="source-link" href="https://github.com/cyco/webfun" target="_blank">
				github.com/cyco/webfun
			</a>,
			<hr />,
			<h2>Yoda(tm) Stories</h2>,
			<div className="copyright">
				&copy;1997 Lucasfilm Ltd. and LucasArts Entertainment Company. All Rights Reserved.
			</div>,
			<div className="box">
				Team Yoda
				<div className="team">
					Hal Barwood
					<br />
					Jesse Clark
					<br />
					Mark Crowley
					<br />
					Randy Tudor
					<br />
					Rachael Bristol
					<br />
					Wayne Cline
					<br />
					Tom Payne
					<br />
					Martin Yee
				</div>
			</div>,
			<Button onclick={() => this.close()} label="OK" />
		);
	}
}

export default AboutWindow;
