'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:updater
 * @description
 * # updater
 */
angular.module('MatchCalendarApp')
    .directive('updater', ['$window', function ($window) {
        return {
            restrict: 'E',
            templateUrl: 'components/updater/updater.html',
            scope: {
                buttonEnabled: '='
            },
            transclude: true,
            link: function($scope) {
                // set up unsupported staus
                $scope.status = 'unsupported';

                if(!angular.isDefined($window.applicationCache)) return;

                $scope.progress = 0;

                $scope.reload = function() {
                    $window.location.reload();
                };

                // register for all appcache events

                function showNothing() {
                    $scope.status = 'idle';
                }

                $window.applicationCache.addEventListener('noupdate', showNothing);
                $window.applicationCache.addEventListener('obsolete', showNothing);

                ['downloading', 'checking', 'cached', 'updateready', 'error'].forEach(function(event) {
                    $window.applicationCache.addEventListener(event, function() {
                        $scope.status = event;
                    });
                });

                $window.applicationCache.addEventListener('progress', function(progress) {
                    $scope.status = 'progress';
                    $scope.progress = progress.loaded / progress.total * 100;
                });
            }
        };
    }]);
