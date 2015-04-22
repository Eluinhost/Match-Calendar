'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostGeneratorCtrl
 * @description
 * # PostGeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('PostGeneratorCtrl', ['$scope', '$window', '$state', '$interpolate', '$modal', '$localForage', 'PostGeneratorRegions', 'PostGeneratorGameType', 'DateTimeService', function ($scope, $window, $state, $interpolate, $modal, $localForage, PostGeneratorRegions, PostGeneratorGameType, DateTimeService) {
        $scope.regions = PostGeneratorRegions;
        $scope.gameTypes = PostGeneratorGameType.types;

        // set up templating
        $scope.templates = $scope.$new(true);

        // set up the raw pre-processed version
        $scope.templates.rawTemplate =
            '\n**Game Information**' +
            '\n---' +
            '\n\n**Opens:** {{ opensUTC() }}' +
            '\n\n**Starts:** {{ startsUTC() }}' +
            '\n\n**Gametype:** Random Teams of 3' +
            '\n\n**Scenario:** Vanilla+' +
            '\n\n**Map Size:** 2000x2000' +
            '\n\n**Nether:** Enabled' +
            '\n\n**Duration:** 90 Minutes + Meetup' +
            '\n\n**PvP:** 15 minutes in' +
            '\n\n**Perma Day:** 30 minutes prior to Meetup' +
            '\n\n**TeamSpeak 3 + Working Mic:** Required' +
            '\n\n**Winner(s):** TBD' +
            '\n___' +
            '\n\n**Server Information**' +
            '\n---' +
            '\n\n**Slots:** 40' +
            '\n\n___' +
            '\n\n**Features**' +
            '\n---' +
            '\n\n**Golden Heads:** Enabled (Heal: 4 hearts)' +
            '\n\n**Absorption:** Disabled' +
            '\n\n**Enderpearl Damage:** Disabled' +
            '\n\n**Death Lightning:** Enabled' +
            '\n\n**Strength II:** Enabled but nerfed' +
            '\n\n**Flint Rates:** Default' +
            '\n\n**Apple Rates:** Default' +
            '\n\n*To know more, /feature list in-game!*' +
            '\n\n___' +
            '\n\n**General Server Information**' +
            '\n---' +
            '\n\n**Location:** ' +
            '\n\n**Server Provider / RAM:** ' +
            '\n\n**IP:** {{ generator.address }}' +
            '\n\n**Version:** 1.7.x' +
            '\n\n___' +
            '\n\n\n**Scenarios**' +
            '\n---' +
            '\n\n* **Vanilla+:** Vanilla with minor tweaks';

        // the compiled version
        $scope.templates.generated = '';

        // save (and load) the template
        $localForage.bind($scope.templates, 'rawTemplate');

        // generator information
        $scope.generator = {
            postTitle: 'Game Title',
            region: 'NA',
            gameType: 'FFA',
            gameTypeData: [],
            scenarios: []
        };

        $scope.$watch('generator.gameType', function(newValue, oldValue) {
            if (oldValue === newValue) return;

            console.log(oldValue, newValue, PostGeneratorGameType.types[newValue].defaultValues());
            $scope.generator.gameTypeData = PostGeneratorGameType.types[newValue].defaultValues();
        });

        // save and load the generator settings
        $localForage.bind($scope, 'generator');

        // add utility functions for templating
        $scope.opensUTC = function() {
            return $scope.T.format($scope.T.formats.REDDIT_POST, $scope.opens, true);
        };
        $scope.startsUTC = function() {
            return $scope.T.format($scope.T.formats.REDDIT_POST, $scope.starts, true);
        };

        // set the opening time to the current time for easy use
        $scope.opens = $scope.T.currentTime();

        // minimum time for things to show
        $scope.minTime = $scope.T.currentTime();

        $scope.addScenario = function (name) {
            if (name === '' || name === null || name === undefined) return;

            if ($scope.generator.scenarios.indexOf(name) === -1) {
                $scope.generator.scenarios.push(name);
            }
        };

        $scope.removeScenario = function (index) {
            $scope.generator.scenarios.splice(index, 1);
        };

        /**
         * Updates $scope.templates.generated with the compiled version of $scope.templates.rawTemplate
         */
        $scope.updateTemplate = function() {
            $scope.templates.generated = $interpolate($scope.templates.rawTemplate, false, null, true)($scope);
        };

        $scope.buildTitle = function() {
            return DateTimeService.format(DateTimeService.formats.REDDIT_POST, $scope.opens.utc(), true) +
                    ' - ' +
                    $scope.generator.region +
                    ' - ' +
                    $scope.generator.postTitle +
                    ' - ' +
                    PostGeneratorGameType.types[$scope.generator.gameType].format($scope.generator.gameTypeData) +
                    ' - ' +
                    $scope.generator.scenarios.join(', ');
        };

        /**
         * opens a new window to create a reddit post with the compiled template and info included
         */
        $scope.openReddit = function() {
            $scope.updateGenerated();
            $scope.updateTemplate();
            $window.open(
                'https://reddit.com/r/ultrahardcore/submit?title=' +
                    encodeURIComponent($scope.buildTitle()) +
                    '&text=' +
                    encodeURIComponent($scope.templates.generated) +
                    encodeURIComponent('\n\n*^created ^using ^the [^Match ^Calendar](' + $window.location.protocol + '//' + $window.location.host + ')*'),
                '_blank');
        };

        $scope.editTemplate = function() {
            $scope.updateTemplate();
            $modal.open({
                templateUrl: 'components/Generator/TemplateEditor.html',
                scope: $scope,
                size: 'lg'
            });
        };
    }]);
