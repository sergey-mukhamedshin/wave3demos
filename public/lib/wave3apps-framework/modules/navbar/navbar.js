/**
 * Navigation bar shows information about available buttons.
 */
(function() {
	'use strict';
	var NAMESPACE = 'navbar';

	angular.module(NAMESPACE, [])
	.constant('navBar', {
		SEL: {
			id: 'SEL',
			title: 'to change'
		},
		EXIT: {
			id: 'EXIT',
			title: 'to cancel'
		},
		UP: {
			id: 'UP',
			title: 'Up'
		},
		DOWN: {
			id: 'DOWN',
			title: 'Down'
		},
		UP_DOWN: {
			id: 'UP_DOWN',
			title: 'Up/Down'
		},
		RIGHT: {
			id: 'RIGHT',
			title: 'to edit'
		},
		LEFT: {
			id: 'LEFT',
			title: 'to cancel'
		}
	})
	.directive('navBar', function() {
		return {
			restrict: 'E',
			replace: true,
			template:
				'<div class="navBar">' +
					'<div ng-repeat="button in navButtons" class="navButton {{button.id}}">' +
						'{{ button.title }}' +
					'</div>' +
				'</div>'
		};
	});
})();