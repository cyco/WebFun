import sandboxed from '../../helpers/dom-sandbox';
import ProgressBar from '/ui/progress-bar';

describe('ProgressBar', sandboxed(function(sand){
	let progressBar;
	it('displays a bar that indicates the current progress of an operation', () => {
		progressBar = new ProgressBar();
		sand.box.appendChild(progressBar.element);
		expect(sand.box.querySelector('.progress-bar')).not.toBe(null);
	});
	
	it('shows the progress in the form of blue segments', () => {
		expect(progressBar.element.querySelectorAll('div').length).toBe(0);
		expect(progressBar.value).toBe(0);
		
		progressBar.value = 1;
		expect(progressBar.element.querySelectorAll('div').length).toBe(24);
		expect(progressBar.value).toBe(1);
		
		progressBar.value = 0;
		expect(progressBar.element.querySelectorAll('div').length).toBe(0);
		expect(progressBar.value).toBe(0);
	});
}));