import Health from './health';

describeComponent(Health, () => {
	let subject;
	
	beforeAll(() => subject = render(Health));
	
	it('displays the hero\'s health in a circle', () => {
		expect(subject.querySelector('svg')).not.toBe(null);
	});
	
	it('starts off with full health', () => {		
		expect(subject.health).toBe(300);
		expect(subject.lives).toBe(3);
		expect(subject.damage).toBe(0);
	});
});
