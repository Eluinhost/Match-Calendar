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

        $scope.gameDetails = {
            opens: $scope.timeOffset.currentTime(),
            starts: $scope.timeOffset.currentTime(),
            address: '192.168.0.1',
            postTitle: 'Game Title',
            region: 'NA',
            opensUTC: function() {
                return $scope.gameDetails.opens.utc().format('DD MMM HH:mm UTC');
            },
            startsUTC: function() {
                return $scope.gameDetails.starts.utc().format('DD MMM HH:mm UTC');
            }
        };

        $scope.$watch('templating.raw', function() {
            $scope.templating.parsed = $interpolate($scope.templating.raw, false, null, true)($scope.gameDetails);
        });

        $scope.templating = {
            raw: '**If you are new, be sure to read the [rules](RULES POST) and [Player FAQ](http://www.reddit.com/r/ultrahardcore/wiki/playerfaq)!**\n' +
                '\n' +
                '---\n' +
                '\n' +
                '***General Info***\n' +
                '\n' +
                'IP Address    | Opens            | Starts           |\n' +
                '--------------|------------------|------------------|\n' +
                '{{ address }} | {{ opensUTC() }} | {{ startsUTC() }}\n' +
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
