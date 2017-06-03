import IconButton from '/ui/components/icon-button';

xdescribe("icon-button", () => {
	let subject;

	it('is a custom element', () => {
		expect(IconButton).toBeCustomElement();
	});

	it('uses the tag name \'wf-icon-button\'', () => {
		expect(IconButton.TagName).toBe('wf-icon-button');
	});

	it('takes a font-awesome icon name in the icon attribute', () => {
		subject = render(IconButton, { icon: 'test' });
		console.log(subject);
		expect(subject.icon).toBe('test');
		expect(subject.querySelector('.fa-test')).not.toBeNull();

		subject.icon = 'my-new-icon';
		expect(subject.querySelector('.my-new-icon')).not.toBeNull();
	});
});
 