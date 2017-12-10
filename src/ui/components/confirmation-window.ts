import { Description } from "../../description";
import Button from "./button";
import "./confirmation-window.scss";
import Window from "./window";

class ConfirmationWindow extends Window {
  public static TagName = "wf-confirmation-window";
  public static observedAttributes = ["text", "confirm-text", "abort-text"];
  public onconfirm: () => void;
  public onabort: () => void;
  private _label: HTMLDivElement;
  private _confirmButton: Button;
  private _abortButton: Button;

  constructor() {
    super();

    this._label = document.createElement("div");
    this._label.classList.add("text");
    this._confirmButton = <Button>document.createElement(Button.TagName);
    this._confirmButton.onclick = () => this.onconfirm();

    this._abortButton = <Button>document.createElement(Button.TagName);
    this._abortButton.onclick = () => this.onabort();

    this.onclose = () => this.onabort();

    this.title = Description.Name;
  }

  connectedCallback(): void {
    this.content.appendChild(this._label);

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buttons.appendChild(this._confirmButton);
    buttons.appendChild(this._abortButton);
    this.content.appendChild(buttons);

    super.connectedCallback();
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    if (attr === "text") {
      this._label.innerText = newValue;
    } else if (attr === "confirm-text") {
      this._confirmButton.setAttribute("label", newValue);
    } else if (attr === "abort-text") {
      this._abortButton.setAttribute("label", newValue);
    } else super.attributeChangedCallback(attr, oldValue, newValue);
  }
}

export default ConfirmationWindow;
