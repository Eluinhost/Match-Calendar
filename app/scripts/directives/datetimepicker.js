'use strict';

/**
 * @ngdoc directive
 * @name matchCalendarApp.directive:DateTimePicker
 * @description
 * # DateTimePicker
 */
angular.module('matchCalendarApp')
    .directive('dateTimePicker', [function () {
        return {
            restrict: 'AE',
            scope: {
                minDate: '=?',
                pickedDate: '=',
                meridian: '=',
                timeZone: '='
            },
            templateUrl: 'views/dateTimePicker.html',
            link: function ($scope, $element, $attr) {
                $scope.opened = false;

                $scope.internalJSDate = $scope.pickedDate.toDate();
                $scope.internalMinDate = $scope.minDate.toDate();

                $scope.$watch('internalJSDate', function () {
                    $scope.updatePickedDate();
                });
                $scope.$watch('timeZone', function () {
                    $scope.updatePickedDate();
                });

                $scope.updatePickedDate = function () {
                    var pickedMoment = moment($scope.internalJSDate);
                    var formattedMoment = pickedMoment.format('MMM DD HH:mm');
                    $scope.pickedDate = moment.tz(formattedMoment, 'MMM DD HH:mm', $scope.timeZone);
                };

                $scope.toggle = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = !$scope.opened;
                }
            }
        }
    }]);
