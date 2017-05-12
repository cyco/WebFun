import { sandboxed } from '../../../../helpers/dom-sandbox';
import Location from '/app/ui/components/location';

xdescribe('Location', sandboxed(function(sand) {
	let subject;
	beforeEach(() => {
		subject = new Location();
		sand.box.appendChild(subject.element);
	});

	it('shows which adjacent zones can be accessed, by default all directions are inaccessible', () => {
		expect(subject.left).toBeFalse();
		expect(subject.down).toBeFalse();
		expect(subject.up).toBeFalse();
		expect(subject.right).toBeFalse();
	});

	describe('activating is done by setting a css class on the svg', () => {
		it('can activate the left arrow', () => {
			subject.left = true;
			expect(subject.left).toBeTrue();
			expect(subject._svg.classList).toContain('left');
		});

		it('can deactivate the left arrow', () => {
			subject.left = true;
			subject.left = false;
			expect(subject.left).toBeFalse();
			expect(subject._svg.classList).not.toContain('left');
		});

		it('can activate the down arrow', () => {
			subject.down = true;
			expect(subject.down).toBeTrue();
			expect(subject._svg.classList).toContain('down');
		});

		it('can deactivate the down arrow', () => {
			subject.down = true;
			subject.down = false;
			expect(subject.down).toBeFalse();
			expect(subject._svg.classList).not.toContain('down');
		});

		it('can activate the right arrow', () => {
			subject.right = true;
			expect(subject.right).toBeTrue();
			expect(subject._svg.classList).toContain('right');
		});

		it('can deactivate the right arrow', () => {
			subject.right = true;
			subject.right = false;
			expect(subject.right).toBeFalse();
			expect(subject._svg.classList).not.toContain('right');
		});

		it('can activate the up arrow', () => {
			subject.up = true;
			expect(subject.up).toBeTrue();
			expect(subject._svg.classList).toContain('up');
		});

		it('can deactivate the up arrow', () => {
			subject.up = true;
			subject.up = false;
			expect(subject.up).toBeFalse();
			expect(subject._svg.classList).not.toContain('up');
		});
	});
}));
