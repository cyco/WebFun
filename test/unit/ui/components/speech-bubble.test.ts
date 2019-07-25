import SpeechBubble from "src/ui/components/speech-bubble";

describeComponent(SpeechBubble, () => {
	let subject: SpeechBubble;
	beforeEach(() => (subject = render(SpeechBubble) as SpeechBubble));

	it("is a class that displays a bubble with text", () => {
		expect(SpeechBubble).toBeClass();
	});
});
