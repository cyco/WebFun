import { dispatch } from "src/util";
import "./reset-cursor";

export default async (node: Element = document.body): Promise<void> => {
	await dispatch(() => node.classList.add("cursor-reset"));
	await dispatch(() => node.classList.remove("cursor-reset"));
};
