export type CoffHeader = {
	machine: number;
	timeDateStamp: number;
	pointerToSymbolTable: number;
	numberOfSections: number;
	numberOfSymbols: number;
	sizeOfOptionalHeader: number;
	characteristics: number;
};

export type Section = {
	name: string;
	virtualSize: number;
	virtualAddress: number;
	bodySize: number;
	bodyOffset: number;
	lineNumbersOffset: number;
	lineNumbersCount: number;
	relocationsOffset: number;
	relocationCount: number;
	characteristics: number;
};

export type MZHeader = {
	magic: "MZ";
	data: Uint8Array;
	peHeaderOffset: number;
};

export type PortableExecutable = {
	mz: MZHeader;
	coff: CoffHeader;
	sections: Section[];
};
