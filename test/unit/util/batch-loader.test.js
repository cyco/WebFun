import BatchLoader from "src/util/batch-loader";

describe("BatchLoader", () => {
	let operationsExecuted;
	let SampleOperation = function () {
		let self = this;
		this.start = () => {
			operationsExecuted++;
			if (self.onfinish) self.onfinish();
		};
	};
	let FailingOperation = function () {
		let self = this;
		this.start = () => {
			operationsExecuted++;
			if (self.onerror) self.onerror();
		};
	};

	beforeEach(() => {
		operationsExecuted = 0;
	});

	it("seuentially executes a bunch of operations", (done) => {
		let started = false;
		let progressed = false;
		let batchLoader = new BatchLoader();
		batchLoader.onstart = () => {
			started = true;
		};
		batchLoader.onprogress = () => {
			progressed = true;
		};
		batchLoader.onfinish = () => {
			expect(started).toBeTrue();
			expect(started).toBe(progressed);
			expect(operationsExecuted).toBe(2);

			done();
		};

		batchLoader.addOperations([ new SampleOperation(), new FailingOperation() ]);
		batchLoader.start();
	});

	it("can't be cancelled yet", (done) => {
		let batchLoader = new BatchLoader();
		batchLoader.onfinish = () => {
			expect(operationsExecuted).toBe(1);
			done();
		};
		batchLoader.addOperation(new SampleOperation());
		batchLoader.start();
		batchLoader.cancel();
	});
});
