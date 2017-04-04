export class _Action {
	constructor(data) {
		this._opcode = data.opcode;
		this._arguments = data.arguments;
		this._additionalData = data.text;

		Object.seal(this);
	}

	get opcode() {
		return this._opcode;
	}

	get arguments() {
		return this._arguments;
	}

	get text() {
		return this._additionalData;
	}
}

export default class Action {
	constructor() {
		this.id = -1;

		this._conditions = [];
		this._instructions = [];

		this.instructionPointer = 0;
		this.enabled = true;
		this.name = null;
		
		this.debug = {};

		Object.seal(this);
	}

	get conditions() {
		return this._conditions;
	}
	
	get instructions() {
		return this._instructions;
	}
}
