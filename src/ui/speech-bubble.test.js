import sandboxed from 'test-helpers/dom-sandbox';
import SpeechBubble from '/ui/speech-bubble';

xdescribe('SpeechBubble', sandboxed(function(sand) {
	it('displays a bubble with text above other views', () => {
		let bubble = new SpeechBubble();
		sand.box.appendChild(bubble.element);

		expect(sand.box.querySelector('.SpeechBubble')).not.toBe(null);
	});

	it('has accessor for the displayed text', () => {
		let bubble = new SpeechBubble();
		bubble.text = 'test';
		expect(bubble.text).toBe('test');
	});
}));
