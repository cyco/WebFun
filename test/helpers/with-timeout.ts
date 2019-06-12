const withTimeout = (timeout: number, block: Function) => () => {
	let previousTimeout: number;

	beforeAll(() => {
		previousTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
	});

	afterAll(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = previousTimeout;
	});

	block();
};

export default withTimeout;
