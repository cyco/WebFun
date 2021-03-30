import "./fullscreen-menu.scss";

import { Component, Menu, MenuItem } from "src/ui";
import { IconButton } from "src/ui/components";

const TransitionDuration = 250 + 50;

class FullscreenMenu extends Component {
	public static readonly tagName = "wf-fullscreen-menu";
	private _parent: HTMLElement = null;
	public onclose: () => void = () => void 0;
	public onclick: () => void = () => this.close();
	private _rootMenu: Menu = null;

	connectedCallback(): void {
		super.connectedCallback();

		this._parent = this.parentElement;
		setTimeout(() => {
			this._parent === this.parentElement && this._parent.setAttribute("fs-menu-open", "");
		});
	}

	disconnectedCallback(): void {
		this._parent.removeAttribute("fs-menu-open");
		this._parent = null;

		super.disconnectedCallback();
	}

	public close(): void {
		this.onclose();
		this._parent.removeAttribute("fs-menu-open");
		setTimeout(() => this.remove(), TransitionDuration);
	}

	public set menu(m: Menu) {
		this._rootMenu = m;

		this.textContent = "";
		this.appendChild(
			<div className="content" onclick={(e: Event) => e.stopPropagation()}>
				<h1>WebFun</h1>
				{m && this.renderItems(m)}
			</div>
		);
	}

	public get menu(): Menu {
		return this._rootMenu;
	}

	private renderMenu(menu: Menu, title?: string) {
		if (!menu) return;

		return (
			<ul>
				<li className="submenu-title" style={{ display: title ? "" : "none" }}>
					<a onclick={() => this.navigateToRoot()}>
						<IconButton icon="chevron-left" />
						<span>{title}</span>
					</a>
				</li>
				{menu.items.map(i => this.renderItem(i))}
			</ul>
		);
	}

	private renderItems(menu: Menu): HTMLElement {
		return <div className="items">{this.renderMenu(menu)}</div>;
	}

	private renderItem(item: MenuItem): HTMLElement {
		if (item.isSeparator) return <div className="hr" />;

		return (
			<li>
				<a onclick={e => this.itemClickHandler(item, e.target as any)}>
					{item.title}
					{item.state !== MenuItem.State.None ? (
						<span className="state">{MenuItem.State[item.state]}</span>
					) : (
						""
					)}
				</a>
				{item.hasSubmenu && this.renderMenu(item.submenu, item.title)}
			</li>
		);
	}

	private itemClickHandler(item: MenuItem, node: HTMLElement) {
		if (item.enabled && item.submenu) this.navigateTo(item, node.closest("li"));
		if (item.enabled && item.callback) {
			item.callback();
			this.close();
		}
	}

	public navigateTo(item: MenuItem, li: HTMLElement): void {
		const parent = this.querySelector(".items > ul") as HTMLElement;
		parent.style.transform = "translateX(-100%)";
		const child = li.querySelector("ul");
		child.style.display = "block";
	}

	private navigateToRoot(): void {
		const parent = this.querySelector(".items > ul") as HTMLElement;
		parent.style.transform = "translateX(0%)";
		parent.querySelectorAll("ul").forEach(child => (child.style.display = "none"));
	}
}

export default FullscreenMenu;
