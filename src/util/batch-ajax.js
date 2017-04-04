import Ajax from './ajax';

export default class BatchAjax {
	static Get(url, data = []) {
		return this._makeAjax(url, data, 'GET');
	}

	static Post(url, data = []) {
		return this._makeAjax(url, data, 'POST');
	}

	static Head(url, data = []) {
		return this._makeAjax(url, data, 'HEAD');
	}

	static Delete(url, data = []) {
		return this._makeAjax(url, data, 'DELETE');
	}

	static _makeAjax(url, data, method) {
		const ajax = new BatchAjax(url, method, data);
		ajax.load();
		return ajax;
	}

	constructor(url, method, data = []) {
		this._url = url;
		this._method = method;

		this._data = data;
		this._results = [];
		this._errors = [];

		this._then = null;
		this._started = 0;
	}

	load() {
		this._data.forEach((data) => {
			this._started++;

			const ajax = Ajax(this._url, this._method, data);
			ajax.then(this._requestFinished.bind(this), this._requestFailed.bind(this));
			ajax.load();
			return ajax;
		});
	}

	then(callback) {
		this._then = callback;
	}

	_requestFailed(error) {
		this._errors.push(error);
		this._started--;
		this._fireThenCallbackIfApropriate();
	}

	_requestFinished(result) {
		this._results.push(result);
		this._started--;
		this._fireThenCallbackIfApropriate();
	}

	_fireThenCallbackIfApropriate() {
		if (this._started !== 0) return;

		this._then(this._results, this._errors);
	}
}
