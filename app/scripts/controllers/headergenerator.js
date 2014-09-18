'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('HeadergeneratorCtrl', ['$scope', '$window', '$state', '$interpolate', function ($scope, $window, $state, $interpolate) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.linkText = {
            opens: '',
            starts: '',
            address: '',
            title: '',
            region: ''
        };

        $scope.templateVars = {
            opens: '',
            starts: '',
            address: '',
            title: '',
            region: ''
        };

        $scope.$watch('opens', function (newValue) {
            $scope.linkText.opens = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.templateVars.opens = newValue.utc().format('DD MMM HH:mm UTC');
            $scope.simpleUtcOpens = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('starts', function (newValue) {
            $scope.linkText.starts = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.templateVars.starts = newValue.utc().format('DD MMM HH:mm UTC');
            $scope.simpleUtcStarts = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('address', function (newValue) {
            var address = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
            $scope.linkText.address = address;
            $scope.templateVars.address = address;
        });
        $scope.$watch('postTitle', function (newValue) {
            var title = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
            $scope.linkText.title = title;
            $scope.templateVars.title = title;
        });
        $scope.$watch('region', function (newValue) {
            $scope.linkText.region = newValue;
            $scope.templateVars.region = newValue;
        });

        $scope.$watch('linkText', function (newValue) {
            $scope.generatedLink = '[' + JSON.stringify(newValue) + '](/matchpost)';
        }, true);

        $scope.$watch('templateVars', function(newValue) {
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
    }]);
