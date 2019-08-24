import { ComponentJSXRenderer } from "src/ui";
import { Components } from "src/ui";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}
type Components<Entry> = Extract<Entry[keyof Entry], { readonly tagName: string } & { new (): any }>;
type ComponentDefinitions<Bundle> = {
	[TagName in Components<Bundle>["tagName"]]: Extract<Components<Bundle>, { tagName: TagName }>;
};
type CustomElements = ComponentDefinitions<typeof Components> &
	ComponentDefinitions<typeof AppComponents> &
	ComponentDefinitions<typeof WindowComponents>;

declare global {
	interface Document {
		createElement<T extends keyof CustomElements>(tagName: T): InstanceType<CustomElements[T]>;
	}
}
