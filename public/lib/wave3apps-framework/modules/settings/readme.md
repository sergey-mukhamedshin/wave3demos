
# Settings

Settings provides a store to keep an application data.

## Usage

```javascript

(function() {
    var NAMESPACE = 'weather';

    angular.module(NAMESPACE, ['settings'])
    .controller('someController', ['$scope', 'settingService', function($scope, settingService) {
        var settings = settingService(NAMESPACE);
        settings.get('key1').then(function(key1Value) { });
        settings.get().then(function(allSettings) { });
        settings.set({key1: 'value', key2: 'value'}).then(function(res) { });
        settings.remove(['key1', 'key1']).then(function(res) { });
        settings.clear().then(function(res) { });
    }]);
})();

```
