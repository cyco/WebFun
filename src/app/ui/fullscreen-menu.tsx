import "./fullscreen-menu.scss";

import { Component, Menu } from "src/ui";

const TransitionDuration = 250 + 50;

class FullscreenMenu extends Component {
	public static readonly tagName = "wf-fullscreen-menu";
	private _parent: HTMLElement;
	public onclose: () => void = () => void 0;
	public onclick: () => void = () => this.close();
	private _menu: Menu;

	connectedCallback() {
		super.connectedCallback();

		this._parent = this.parentElement;
		setTimeout(
			() => this._parent === this.parentElement && this._parent.setAttribute("fs-menu-open", "")
		);
	}

	disconnectedCallback() {
		this._parent.removeAttribute("fs-menu-open");
		this._parent = null;

		super.disconnectedCallback();
	}

	public close() {
		this.onclose();
		this._parent.removeAttribute("fs-menu-open");
		setTimeout(() => this.remove(), TransitionDuration);
	}

	public set menu(m: Menu) {
		this._menu = m;

		this.textContent = "";
		this.appendChild(
			<div className="content" onclick={(e: Event) => e.stopPropagation()}>
				<h1>WebFun</h1>
				<div className="items">
					{m &&
						m.items
							.filter(i => i.hasSubmenu && i.submenu && i.submenu.items)
							.map(i => (
								<ul>
									{i.submenu.items
										.filter(itm => !itm.isSeparator)
										.map(itm => (
											<li>
												<a onclick={() => itm.enabled && itm.callback()}>
													{itm.title}
												</a>
											</li>
										))}
								</ul>
							))
							.reduce((prev, current, idx) => {
								if (idx === 0) return [current];
								return prev.concat([<div className="hr" />], [current]);
							}, [])}
				</div>
			</div>
		);
	}

	public get menu() {
		return this._menu;
	}
}

export default FullscreenMenu;
