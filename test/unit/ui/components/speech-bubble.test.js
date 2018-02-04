import SpeechBubble from "src/ui/components/speech-bubble";

describeComponent(SpeechBubble, () => {
	let subject;
	beforeEach(() => (subject = render(SpeechBubble)));

	it("is a class that displays a bubble with text", () => {
		expect(SpeechBubble).toBeClass();
	});
});
