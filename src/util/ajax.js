import QueryString from './query-string';

export default class Ajax {
	static Get(url, data = {}) {
		return this._makeAjax(url, data, 'GET');
	}

	static Post(url, data = {}) {
		return this._makeAjax(url, data, 'POST');
	}

	static Head(url, data = {}) {
		return this._makeAjax(url, data, 'HEAD');
	}

	static Delete(url, data = {}) {
		return this._makeAjax(url, data, 'DELETE');
	}

	static _makeAjax(url, data, method) {
		let my_ajax = new Ajax(url, method, data);
		my_ajax.load();
		return my_ajax;
	}

	constructor(url, method, data = null) {
		this._url = url;
		this._method = method;
		this._data = data;
		this._result = null;
		this._error = null;

		this._successCallbacks = [];
		this._failCallbacks = [];
		this._thenCallbacks = [];
		
		this._resolve = null;
		this._reject = null;
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
		
		this._responseInvalid = false;
		this._request = new XMLHttpRequest();
		this._request.onreadystatechange = this._requestStateChanged.bind(this);
	}

	_requestStateChanged(event) {
		const request = event.target;
		if (request.readyState !== XMLHttpRequest.DONE)
			return;

		this._requestFinished(request);
	}

	_requestFinished(request) {
		let response = request.response;
		let contentType = request.getResponseHeader('Content-Type') || '';
		if (contentType.split(';').first() === 'application/json') {
			try {
				response = JSON.parse(response);
			} catch (e) {
				this._responseInvalid = true;
			}
		}
		if (this.failed) {
			this._error = response;
			this._reject(response);
		}

		if (this.succeeded) {
			this._result = response;
			this._resolve(response);
		}
	}

	success(callback) {
		this._promise.then(callback);
		return this;
	}

	catch(callback) {
		this._promise.catch(callback);
		return this;
	}

	then(callback, fail) {	
		let failCallback = fail || callback;
		this._promise.then(() => {
			callback(this._result, this._error);
		}, () => {
			failCallback(this._result, this._error);
		});
		return this;
	}

	get request() {
		return this._request;
	}

	load() {
		let url = this._url;
		if (this._method === 'GET') {
			let queryString = QueryString.Compose(this._data);
			if (queryString) url += '?' + queryString;
			this._data = null;
		}

		this._request.open(this._method, url);
		this._request.send(this._data);

		this._data = null;
	}

	get succeeded() {
		return this.finished && (!this._responseInvalid && this.request.status.isInRange(200, 299));
	}

	get failed() {
		return this.finished && (this._responseInvalid || this.request.status >= 400);
	}

	get finished() {
		return this.request.readyState === XMLHttpRequest.DONE;
	}
}
