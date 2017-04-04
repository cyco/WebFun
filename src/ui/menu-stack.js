import {EventTarget} from '/util';

let sharedMenuStack = null;

export default class MenuStack extends EventTarget {
	static get sharedStack(){
		return (sharedMenuStack = sharedMenuStack || new MenuStack());
	}
	
    constructor() {
        super();

        this._stack = [];
    }

    push(menu) {
        this._stack.push(menu);
        menu.element.style.zIndex = 1001 + this._stack.length;
        document.body.appendChild(menu.element);
    }

    pop(menu) {
        let index = this._stack.indexOf(menu);
        if (index === -1) return;

        for (let i = this._stack.length; i > index; i--) {
            let menu = this._stack[i - 1];
            menu.close();
            this._stack.pop();
        }
    }

    clear() {
        while (this._stack.length) {
            this.pop(this._stack.last());
        }
    }
}