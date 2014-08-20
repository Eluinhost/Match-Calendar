'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('HeadergeneratorCtrl', ['$scope', function ($scope) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.generated = {
            opens: '',
            starts: '',
            address: '',
            title: '',
            region: ''
        };

        $scope.$watch('opens', function (newValue) {
            $scope.generated.opens = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.simpleUtcOpens = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('starts', function (newValue) {
            $scope.generated.starts = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.simpleUtcStarts = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('address', function (newValue) {
            $scope.generated.address = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('post_title', function (newValue) {
            $scope.generated.title = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('region', function (newValue) {
            $scope.generated.region = newValue;
        });

        $scope.$watch('generated', function (newValue) {
            $scope.generatedLink = '[' + JSON.stringify(newValue) + '](/matchpost)';
        }, true);

        $scope.opens = $scope.timeOffset.currentTime();
        $scope.starts = $scope.timeOffset.currentTime();
        $scope.address = '192.168.0.1';
        $scope.post_title = 'Game Title';
        $scope.region = 'NA';
    }])
