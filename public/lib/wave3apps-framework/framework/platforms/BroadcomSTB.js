'use strict';

platform.add(function () {
	var broadcom = angular.copy(platform.get('Default'));
	broadcom.name = 'Broadcom STB';
	return broadcom;
});