import RadioGroup from "src/ui/components/radio-group";
import { RadioButton } from "src/ui/components";

describe("RadioGroup", () => {
	it("provides a method for grouping radio buttons", () => {
		const button: RadioButton = {} as any;

		const group = new RadioGroup();
		group.addButton(button);
		expect(group.buttons.length).toBe(1);
		expect(group.buttons[0]).toBe(button);
		expect(button.groupID).not.toBe(undefined);
	});

	it("buttons can also be passed in to the constructor", () => {
		const button: RadioButton = {} as any;

		const group = new RadioGroup([button]);
		expect(group.buttons.length).toBe(1);
		expect(group.buttons[0]).toBe(button);
		expect(button.groupID).not.toBe(undefined);
	});
});
