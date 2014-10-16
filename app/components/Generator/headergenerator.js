'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('HeadergeneratorCtrl', ['$scope', '$window', '$state', '$interpolate', '$modal', function ($scope, $window, $state, $interpolate, $modal) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.minTime = $scope.T.currentTime();
        $scope.opens = $scope.T.currentTime();
        $scope.starts = $scope.T.currentTime();

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
                'Winner: |\n' +
                '--------|\n' +
                'TBA     |\n' +
                '\n' +
                '***Scenario(s)***\n' +
                '\n' +
                '* Vanilla+ - Vanilla with a few minor changes'
        };

        $scope.updateGenerated = function() {
            var generatedVersion = {
                opens: $scope.opens.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                starts: $scope.starts.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                address: $scope.settings.generator.address.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                title:  $scope.settings.generator.postTitle.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                region: $scope.settings.generator.region
            };

            $scope.generatedLink = '[' + JSON.stringify(generatedVersion) + '](/matchpost)';
        };

        $scope.openReddit = function() {
            $scope.updateGenerated();
            window.open(
                    'https://reddit.com/r/ultrahardcore/submit?title='
                  + encodeURIComponent($scope.settings.generator.postTitle)
                  + '&text=' + encodeURIComponent($scope.templating.parsed)
                  + '\n'
                  + encodeURIComponent($scope.generatedLink)
                , '_blank');
        };

        $scope.openLinkModal = function() {
            $scope.updateGenerated();
            $modal.open({
                templateUrl: 'components/Generator/matchPostLink.html',
                scope: $scope
            });
        };
    }]);
