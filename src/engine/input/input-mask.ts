const enum InputMask {
	None = 0,

	Up = 1 << 0,
	Down = 1 << 1,
	Left = 1 << 2,
	Right = 1 << 3,

	PickUp = 1 << 4,
	Pause = 1 << 5,
	Locator = 1 << 6,
	EndDialog = 1 << 7,
	ScrollDown = 1 << 8,
	Attack = 1 << 9,
	Walk = 1 << 10,
	Drag = 1 << 11,
	ScrollUp = 1 << 12
}

export default InputMask;
