export type AbstractActionItemInit = Partial<{opcode: number, arguments: any[], text: string}>;

class AbstractActionItem {
	protected _opcode: number;
	protected _arguments: any[];
	protected _additionalData: string;

	constructor(data: AbstractActionItemInit = {}) {
		this._opcode = data.opcode;
		this._arguments = data.arguments;
		this._additionalData = data.text;
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

export default AbstractActionItem;
