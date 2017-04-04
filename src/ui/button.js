import View from './view';

export default class Button extends View {
	constructor() {
		super(document.createElement('button'));

		this.element.classList.add('Button');
		this.element.appendChild(document.createElement('div'));
	}

	set title(t) {
		this.element.clear();
		this.element.append(t);
	}

	get title() {
		return this.element.textContent;
	}

	setImage(src, width, height) {
		this.element.clear();
		const imageNode = document.createElement('img');
		imageNode.src = src;
		imageNode.style.width = width + 'px';
		imageNode.style.height = height + 'px';
		this.element.appendChild(imageNode);
	}

	set onclick(h) {
		this.element.onclick = h;
	}

	get onclick() {
		return this.element.onclick;
	}

	get enabled() {
		return !this.element.disabled;
	}

	set enabled(flag) {
		this.element.disabled = !flag;
	}
}
