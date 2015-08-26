# Messaging Service

Publisher
    send(*namespace:topic, message, {<options>}).then(function(res) { });

Subscriber (Listener)
    subscribe(*namespace:topic, {<options>}, *listener);
    unsubscribe(*namespace:topic, *listener);

listener = function(envelope) {
    envelope.from
    envelope.topic
    envelope.message
}

## Usage

```javascript

(function() {
    var NAMESPACE = 'weather';

    angular.module(NAMESPACE, [])
    .controller('someController', ['$scope', 'messagingService', function($scope, messagingService) {
        var ms = messagingService(NAMESPACE);

        $scope.onDashboardHide = function(envelope) {
            $scope.showWeather();
        };

        // set listen Dashboard hide message
        ms.subscribe('dashboard:hide', $scope.onDashboardHide);

        // remove listen Dashboard hide message
        ms.unsubscribe('dashboard:hide', $scope.onDashboardHide);

        // listen self setMode message
        ms.subscribe(NAMESPACE + ':setMode', function(envelope) {
            $scope.mode = envelope.message;
        });

        // send message to all, who listen this type of message
        ms.send(NAMESPACE + ':show').then(
            function(successEvent) {},
            function(errorEvent) {}
        );
    }]);
})();

(function() {
    var NAMESPACE = 'dashboard';

    angular.module(NAMESPACE, [])
    .controller('someController', ['$scope', 'messagingService', function($scope, messagingService) {
        var ms = messagingService(NAMESPACE);

        // send message to known application
        ms.send('weather:setMode', 'fullscreen').then(
            function(successEvent) {},
            function(errorEvent) {}
        );

        // send message to all, who listen this type of message
        ms.send(NAMESPACE + ':hide', '', {}).then(
            function(successEvent) {},
            function(errorEvent) {}
        );
    }]);
})();

```