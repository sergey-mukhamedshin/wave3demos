(function() {
	ztv.q = {};

	ztv.q.defer = function() {
		return new Deferred();
	};

	ztv.q.all = function(promises) {
		var deferred = new Deferred();
		var toResolve = promises.length;

		function resolve() {
			if (--toResolve <= 0)
				deferred.resolve();
		}
		function reject(message) {
			deferred.reject(message);
		}

		for (var i = 0; i < toResolve; ++i)
			promises[i].then(resolve, reject);

		return deferred.promise;
	};

	/* private */

	function Deferred() {
		this.promise = new Promise();
	}

	Deferred.prototype.resolve = function(message) {
		this.promise._resolve(message);
	};

	Deferred.prototype.reject = function(message) {
		this.promise._reject(message);
	};

	var STATUSES = {
		RESOLVED: 'resolved',
		REJECTED: 'rejected'
	};

	function Promise() {
		this._resolveQueue = [];
		this._rejectQueue = [];
	}

	Promise.prototype.then = function(onFulfilled, onRejected) {
		if (onFulfilled instanceof Function)
			this._resolveQueue.push(onFulfilled);
		if (onRejected instanceof Function)
			this._rejectQueue.push(onRejected);

		if (this.status == STATUSES.REJECTED)
			this._reject(this._message);
		else if (this.status == STATUSES.RESOLVED)
			this._resolve(this._message);
	};

	Promise.prototype._resolve = function(message) {
		this.status = STATUSES.RESOLVED;

		if (message)
			this._message = message;
		else
			message = this._message;

		var callback = this._resolveQueue.shift();
		while (callback) {
			callback(message);
			callback = this._resolveQueue.shift();
		}
	};

	Promise.prototype._reject = function(message) {
		this.status = STATUSES.REJECTED;

		if (message)
			this._message = message;
		else
			message = this._message;

		var callback = this._rejectQueue.shift();
		while (callback) {
			callback(message);
			callback = this._rejectQueue.shift();
		}
	};
})();
