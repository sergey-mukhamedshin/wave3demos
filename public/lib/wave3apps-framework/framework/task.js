'use strict';

angular.module('task', ['logging']).service('task', ['console', function (console) {
	var taskPool;

	function reset() {
		taskPool = {};
	}

	function createTask(taskName) {
		var task = taskPool[taskName];
		if (task)
			++task.lastId;
		else
			task = taskPool[taskName] = { lastId: 1, ignoredId: 0 };

		return task;
	}

	function getPromiseWrapper(promise, strategy) {
		return {
			then: function (successCallback, errorCallback, progressCallback) {
				promise.then(
					function () {
						strategy('success', successCallback, arguments);
					},
					function () {
						strategy('error', errorCallback, arguments);
					},
					function () {
						strategy('progress', progressCallback, arguments);
					});
			}
		};
	}

	function run(taskName, promise) {
		var task = createTask(taskName);
		var currentTaskId = task.lastId;
		console.info('calling task %1 #%2', taskName, currentTaskId);

		return getPromiseWrapper(promise, function (resultType, callback, parameters) {
			if (currentTaskId <= task.ignoredId)
				console.info('%1 callback for task %2 #%3 ignored', resultType, taskName, currentTaskId);
			else {
				console.info('calling %1 callback for task %2 #%3', resultType, taskName, currentTaskId);
				callback.apply(callback, parameters);
			}
		});
	}

	function runOnlyLast(taskName, promise) {
		var task = createTask(taskName);
		var currentTaskId = task.lastId;
		console.info('calling task %1 #%2', taskName, currentTaskId);

		return getPromiseWrapper(promise, function (resultType, callback, parameters) {
			if (currentTaskId <= task.ignoredId)
				console.info('%1 callback for task %2 #%3 ignored', resultType, taskName, currentTaskId);
			else if (currentTaskId == task.lastId) {
				console.info('calling %1 callback for task %2 #%3', resultType, taskName, currentTaskId);
				callback.apply(callback, parameters);
			} else
				console.info('%1 callback for task %2 #%3 ignored as not being last', resultType, taskName, currentTaskId);
		});
	}

	function ignore(taskName) {
		console.info('task %1 will be ignored', taskName);
		var task = taskPool[taskName];
		if (task)
			task.ignoredId = task.lastId;
	}

	reset();

	return {
		reset: reset,
		run: run,
		runOnlyLast: runOnlyLast,
		ignore: ignore
	};
}]);