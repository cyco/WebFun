import sandboxed from '../../helpers/dom-sandbox';
import RadioButton from '/ui/radio-button';

describe('RadioButton', sandboxed(function(sand) {
	it('manages a radio input element', () => {
		let radio = new RadioButton();
		sand.box.appendChild(radio.element);
		expect(sand.box.querySelector('input[type=radio]')).toBeTruthy();
	});

	it('can be created with a pre-set title', () => {
		let title = 'a radio button title';
		let radio = new RadioButton(title);
		sand.box.appendChild(radio.element);

		expect(radio.element.innerHTML.indexOf(title)).not.toBe(-1);
	});

	it('the title can also be changed later', () => {
		let title = 'button title';
		let newTitle = 'new button title';

		let radio = new RadioButton(title);
		sand.box.appendChild(radio.element);
		expect(radio.title).toBe(title);

		radio.title = newTitle;
		expect(radio.title).toBe(newTitle);
		expect(radio.element.innerHTML.indexOf(newTitle)).not.toBe(-1);
	});

	it('can be checked', () => {
		let radio = new RadioButton();
		sand.box.appendChild(radio.element);

		expect(radio.checked).toBeFalse();
		expect(sand.box.querySelector('input[checked]')).toBeFalsy();

		radio.checked = true;
		expect(radio.checked).toBeTrue();
		expect(sand.box.querySelector('input[checked]')).toBeTruthy();

		radio.checked = false;
		expect(radio.checked).toBeFalse();
		expect(sand.box.querySelector('input[checked]')).toBeFalsy();
	});

	it('can be assigned to a group', () => {
		let radio = new RadioButton();
		sand.box.appendChild(radio.element);

		let groupID = 'someid';

		radio.groupID = groupID;
		expect(radio.groupID).toBe(groupID);
		expect(sand.box.querySelector('input[name=' + groupID + ']')).toBeTruthy();
	});

	it('can be created and assigned to a group at the same time', (done) => {
		let groupMock = {
			addButton: () => {
				expect(true).toBeTrue();
				done();
			}
		};

		new RadioButton('', groupMock);
	});

	xit('an on change event is triggered when the button\'s physical state changes', (done) => {
		let radio = new RadioButton();
		radio.onchange = done;
		sand.box.appendChild(radio.element);

		expect(radio.onchange).toBe(done);
		sand.box.querySelector('input[type=radio]').click();
	});
}));
