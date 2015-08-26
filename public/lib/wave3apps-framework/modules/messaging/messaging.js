/**
 * Messaging service.
 */
(function() {
	'use strict';
	var namespaces = {};

	angular.module('messaging', [])
	.factory('messagingService', ['$q', function($q) {
		return function(namespace) {
			function parse(topic) {
				var index = topic.lastIndexOf(':');

				return {
					namespace: index != -1 ? topic.substr(0, index) : namespace,
					topic: index != -1 ? topic.substr(index + 1) : topic
				};
			}

			return {
				subscribe: function(topic, options, listener) {
					var parsed = parse(topic);

					if (!namespaces[parsed.namespace])
						namespaces[parsed.namespace] = {};

					var ns = namespaces[parsed.namespace];

					if (!ns[parsed.topic])
						ns[parsed.topic] = [];

					// TODO use options
					if (typeof listener == 'undefined')
						listener = options;

					if (ns[parsed.topic].indexOf(listener) == -1) {
						listener.namespace = namespace;
						ns[parsed.topic].push(listener);
					}
				},
				unsubscribe: function(topic, listener) {
					var parsed = parse(topic);
					var ns = namespaces[parsed.namespace];

					if (ns && ns[parsed.topic]) {
						var i = ns[parsed.topic].indexOf(listener);
						if (i != -1)
							ns[parsed.topic].splice(i, 1);
					}
				},
				send: function(topic, data, options) {
					var deferred = $q.defer();

					setTimeout(function() {
						var parsed = parse(topic);
						var ns = namespaces[parsed.namespace];
						if (processOptions(ns, parsed, data, namespace, options))
							deferred.resolve({message: 'OK'});
						else if (ns) {
							angular.forEach(ns[parsed.topic], function(listener) {
								listener({
									from: namespace,
									topic: parsed.topic,
									message: data
								});
							});

							deferred.resolve({message: 'OK'});
						}
						else
							deferred.reject({message: 'Namespace ' + parsed.namespace + ' not found (have no listeners)!'});
					}, 0);

					return deferred.promise;
				}
			};
		};
	}]);

	function processOptions(ns, parsed, data, from, options) {
		if (!options)
			return false;
		else if ('broadcast' in options && !options.broadcast) {
			angular.forEach(ns[parsed.topic], function(listener) {
				if (listener.namespace == options.namespace)
					listener({
						from: from,
						topic: parsed.topic,
						message: data
					});
			});
			return true;
		}
		else if ('waitForSubscriber' in options && options.waitForSubscriber) {
			if (ns && ns[parsed.topic] && ns[parsed.topic].length > 0)
				angular.forEach(ns[parsed.topic], function(listener) {
					listener({
						from: from,
						topic: parsed.topic,
						message: data
					});
				});
			else {
				setTimeout(function() {
					processOptions(namespaces[parsed.namespace], parsed, data, from, options);
				}, 10);
			}
			return true;
		}

		return false;
	}
})();