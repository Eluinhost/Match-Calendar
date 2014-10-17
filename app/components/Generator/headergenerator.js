'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('HeadergeneratorCtrl', function ($scope, $window, $state, $interpolate, $modal, $localForage) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.template =
            '**If you are new, be sure to read the [rules](RULES POST) and [Player FAQ](http://www.reddit.com/r/ultrahardcore/wiki/playerfaq)!**\n' +
            '\n' +
            '---\n' +
            '\n' +
            '***General Info***\n' +
            '\n' +
            'IP Address    | Opens            | Starts           |\n' +
            '--------------|------------------|------------------|\n' +
            '{{ generator.address }} | {{ opensUTC() }} | {{ startsUTC() }}\n' +
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
            '* Vanilla+ - Vanilla with a few minor changes';

        //save the template
        $localForage.bind($scope, 'template');

        $scope.generator = {
            address: '192.168.0.1',
            postTitle: 'Game Title',
            region: 'NA'
        };

        //save the settings
        $localForage.bind($scope, 'generator');

        //add utility functions
        $scope.opensUTC = function() {
            return $scope.T.format($scope.T.formats.GENERATOR_SIMPLE, $scope.opens, true);
        };
        $scope.startsUTC = function() {
            return $scope.T.format($scope.T.formats.GENERATOR_SIMPLE, $scope.starts, true);
        };

        //add the non-settings
        $scope.opens = $scope.T.currentTime();
        $scope.starts = $scope.T.currentTime();

        //minimum time for things to show
        $scope.minTime = $scope.T.currentTime();

        //update $scope.generatedLink with the matchpost link
        $scope.updateGenerated = function() {
            var generatedVersion = {
                opens: $scope.opens.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                starts: $scope.starts.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                address: $scope.generator.address.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                title:  $scope.generator.postTitle.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;'),
                region: $scope.generator.region
            };

            $scope.generatedLink = '[' + JSON.stringify(generatedVersion) + '](/matchpost)';
        };

        $scope.updateTemplate = function() {
            $scope.generatedTemplate = $interpolate($scope.template, false, null, true)($scope);
        };

        //open a new window to create a reddit post with the template
        $scope.openReddit = function() {
            $scope.updateGenerated();
            $scope.updateTemplate();
            window.open(
                    'https://reddit.com/r/ultrahardcore/submit?title='
                  + encodeURIComponent($scope.generator.postTitle)
                  + '&text=' + encodeURIComponent($scope.generatedTemplate)
                  + '\n'
                  + encodeURIComponent($scope.generatedLink)
                , '_blank');
        };

        //opens a modal to copy/paste the link from
        $scope.openLinkModal = function() {
            $scope.updateGenerated();
            $modal.open({
                templateUrl: 'components/Generator/matchPostLink.html',
                scope: $scope
            });
        };
    });
