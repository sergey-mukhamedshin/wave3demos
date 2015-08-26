(function(angular) {
    "use strict";

    var ctrlModule = angular.module('ctrlModule', []);
    ctrlModule.controller('rowCtrl',[ '$scope', function ($scope) {
        $scope.data = [];
        $scope.addNewRow = function() {
            var newRow = {
                "id": "id",
                "const": "const",
                "message": "message",
                "description": "description"
            };
            $scope.data.push(newRow);
        };
        $scope.mouseenter = function($event) {
            $event.currentTarget.style.opacity = "1";
        };
        $scope.mouseleave = function($event) {
            $event.currentTarget.style.opacity = "0.2";
        };
        $scope.deleteRow = function($event, $index) {
            $scope.data.splice($index,1);
        };
        $scope.saveJSONFile = function() {
          var data = $scope.clean($scope.data, ['$$hashKey']),
            text = JSON.stringify({"messages": data}, null, "  "),
            a = document.createElement('a');
          a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          a.setAttribute('download', $scope.fileName);
          a.click();
        };
        $scope.clean = function(hash, keys) {
            if (typeof hash != 'string' && typeof hash != 'number')
                angular.forEach(hash, function(value, key) {
                    if (keys.indexOf(key) != -1) {
                        delete hash[key];
                    } else {
                        $scope.clean(value, keys);
                    }
                });
            return hash;
        };
    }])
  .directive("fileread", [function () {
    return {
      link: function (scope, element /*, attributes */) {
        element.bind("change", function (evt) {
          var file = (evt.target || evt.srcElement).files[0];
          scope.fileName = file.name;
          console.groupCollapsed(file.name);
          console.log('File "%s" has been selected.', file.name);
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            console.log('File "%s" has been loaded.', file.name);
            scope.$apply(function () {
              var data = JSON.parse(loadEvent.target.result);
              console.log(scope.data = data["messages"]);
              console.groupEnd();
            });
          };
          reader.readAsText(file);
        });
      }
    }
  }]);
})(angular);
