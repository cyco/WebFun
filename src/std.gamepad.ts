import { global } from "./std";

const Events = {
	GamepadConnected: "gamepadconnected",
	GamepadDisconnected: "gamepadisconnected"
};

const { Gamepad, GamepadButton, GamepadEvent } = global;

export { Gamepad, GamepadButton, GamepadEvent, Events };
