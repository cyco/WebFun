import { Zone } from "src/engine/objects";

export default ({ type }: Zone): boolean =>
	type !== Zone.Type.Load &&
	type !== Zone.Type.Lose &&
	type !== Zone.Type.Room &&
	type !== Zone.Type.Win &&
	type !== Zone.Type.None;
