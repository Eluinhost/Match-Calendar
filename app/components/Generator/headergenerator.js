'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('HeadergeneratorCtrl', function ($scope, $localForage) {
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
        });
        $scope.$watch('starts', function (newValue) {
            $scope.generated.starts = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        });
        $scope.$watch('settings.generator.address', function (newValue) {
            $scope.generated.address = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('settings.generator.postTitle', function (newValue) {
            $scope.generated.title = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('settings.generator.region', function (newValue) {
            $scope.generated.region = newValue;
        });

        $scope.$watch('generated', function (newValue) {
            $scope.generatedLink = '[' + JSON.stringify(newValue) + '](/matchpost)';
        }, true);

        $scope.opens = $scope.T.currentTime();
        $scope.starts = $scope.T.currentTime();
    });
