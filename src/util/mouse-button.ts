const enum MouseButton {
	Main = 0, // Main button pressed, usually the left button or the un-initialized state
	Auxiliary = 1, // Auxiliary button pressed, usually the wheel button or the middle button (if present)
	Secondary = 2, // Secondary button pressed, usually the right button
	Fourth = 3, // Fourth button, typically the Browser Back button
	Fifth = 4 // Fifth button, typically the Browser Forward button
}
export default MouseButton;
