'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('HeadergeneratorCtrl', function ($scope, $window, $state, $interpolate, $modal) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.templateVars = {
            opens: '',
            starts: '',
            address: '',
            title: '',
            region: ''
        };

        $scope.$watch('opens', function (newValue) {
            $scope.templateVars.opens = newValue.utc().format('DD MMM HH:mm UTC');
        });
        $scope.$watch('starts', function (newValue) {
            $scope.templateVars.starts = newValue.utc().format('DD MMM HH:mm UTC');
        });
        $scope.$watch('address', function (newValue) {
            $scope.templateVars.address = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('postTitle', function (newValue) {
            $scope.templateVars.title = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('region', function (newValue) {
            $scope.templateVars.region = newValue;
        });

        $scope.$watch('templateVars', function() {
            $scope.updateTemplate();
        }, true);

        $scope.opens = $scope.timeOffset.currentTime();
        $scope.starts = $scope.timeOffset.currentTime();
        $scope.address = '192.168.0.1';
        $scope.postTitle = 'Game Title';
        $scope.region = 'NA';

        $scope.templating = {
            raw: '**If you are new, be sure to read the [rules](RULES POST) and [Player FAQ](http://www.reddit.com/r/ultrahardcore/wiki/playerfaq)!**\n' +
                '\n' +
                '---\n' +
                '\n' +
                '***General Info***\n' +
                '\n' +
                'IP Address | Opens | Starts |\n' +
                '-----------|--------|-------|\n' +
                '{{ address }} | {{ opens }} | {{ starts }}\n' +
                '\n' +
                '---\n' +
                '\n' +
                '***Match Info***\n' +
                '\n' +
                '* **Golden Heads** - Enabled\n' +
                '* **Absorption** - Disabled\n' +
                '* **Towering** - Allowed\n' +
                '* **Stealing** - Allowed\n' +
                '* **Stalking** - Not Allowed\n' +
                '* **PvP/iPvP** - 15 minutes in\n' +
                '* **Map Size** - 2500x2500\n' +
                '* **Game Length** - 90 minutes\n' +
                '* **Nether** - Enabled\n' +
                '* **Slots** - 60\n' +
                '\n' +
                '---\n' +
                '\n' +
                '    Winner: |\n' +
                '---|\n' +
                'TBA |\n' +
                '\n' +
                '***Scenario(s)***\n' +
                '\n' +
                '* Vanilla+ - Vanilla with a few minor changes'
        };

        $scope.updateTemplate = function() {
            $scope.templating.parsed = $interpolate($scope.templating.raw, false, null, true)($scope.templateVars);
        };

        $scope.sendToReddit = function() {
            $window.location.href = '/api/auth?callback=' + encodeURIComponent($state.href('auth', {}, {absolute: true}));
        };

        $scope.openLinkModal = function() {
            var generatedVersion = {
                opens: $scope.opens.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                starts: $scope.starts.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                address: $scope.address.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                title: $scope.postTitle.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                region: $scope.region
            };

            $scope.generatedLink = '[' + JSON.stringify(generatedVersion) + '](/matchpost)';

            $modal.open({
                templateUrl: 'views/matchPostLink.html',
                scope: $scope
            });
        };
    });
