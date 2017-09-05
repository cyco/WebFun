export const disassemble = (action) => {
	const disassembleItem = (item) => [ item.opcode ].concat(item.arguments).join(" ");
	return action.conditions.map(disassembleItem).concat([ "" ]).concat(action.instructions.map(disassembleItem)).join("\n");
};

export const assemble = (string) => {

};
