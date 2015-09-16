'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostGeneratorCtrl
 * @description
 * # PostGeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('PostGeneratorCtrl', [
           '$scope', '$window', '$state', '$interpolate', '$modal', '$localForage', 'PostGeneratorRegions', 'GameType', 'DateTimeService', 'Templates', 'Subreddits', function (
            $scope,   $window,   $state,   $interpolate,   $modal,   $localForage,   PostGeneratorRegions,   GameType,   DateTimeService,   Templates,   Subreddits) {
        $scope.regions = PostGeneratorRegions;
        $scope.gameTypes = GameType.types;
        $scope.DateTime = DateTimeService;
        $scope.templates = Templates;
        $scope.subreddits = Subreddits;

        // generator information
        $scope.generator = {
            postTitle: 'Game Title',
            region: 'NA',
            gameType: 'FFA',
            teamSize: 4,
            scenarios: ['Vanilla'],
            subreddit: Subreddits.subreddits[0] || null
        };

        if (!$scope.generator.template && Templates.customTemplates[0]) {
            $scope.generator.template = Templates.customTemplates[0].name;
        }

        // save and load the generator settings
        $localForage.bind($scope, 'generator');

        // set the opening time to the current time for easy use
        $scope.opens = DateTimeService.currentTime();

        // minimum time for things to show
        $scope.minTime = DateTimeService.currentTime();

        $scope.requiresTeamSizes = function() {
            return GameType.types[$scope.generator.gameType].requiresTeamSizes;
        };

        $scope.addScenario = function (name) {
            if (name === '' || name === null || name === undefined) return;

            if ($scope.generator.scenarios.indexOf(name) === -1) {
                $scope.generator.scenarios.push(name);
            }

            $scope.generator.scenarios = $scope.generator.scenarios.map(function(scenario) {
                return scenario.toLowerCase() === 'vanilla' ? 'Vanilla+' : scenario;
            });
        };

        $scope.removeScenario = function (index) {
            $scope.generator.scenarios.splice(index, 1);

            if ($scope.generator.scenarios.length === 0) {
                $scope.generator.scenarios.push('Vanilla');
            }
        };

        $scope.validTemplate = function() {
            return $scope.generator.template && Templates.customTemplateExists($scope.generator.template);
        };

        $scope.validSubreddit = function() {
            return $scope.generator.subreddit && Subreddits.subreddits.indexOf($scope.generator.subreddit) !== -1;
        };

        $scope.buildTitle = function() {
            return DateTimeService.format(DateTimeService.formats.REDDIT_POST, $scope.opens.utc(), true) +
                    ' - ' +
                    $scope.generator.region +
                    ' - ' +
                    $scope.generator.postTitle +
                    ' - ' +
                    GameType.types[$scope.generator.gameType].format($scope.generator.teamSize) +
                    ' - ' +
                    $scope.generator.scenarios.join(', ');
        };

        var templateVariables = {
            get opensUTC() {
                return DateTimeService.format(DateTimeService.formats.REDDIT_POST, $scope.opens, true);
            },
            get title() {
                return $scope.generator.postTitle;
            },
            get region() {
                return $scope.generator.region;
            },
            get teams() {
                return GameType.types[$scope.generator.gameType].format($scope.generator.teamSize);
            },
            get scenarios() {
                return $scope.generator.scenarios.join(', ');
            },
            get DateTime() {
                return DateTimeService;
            }
        };

        /**
         * opens a new window to create a reddit post with the compiled template and info included
         */
        $scope.openReddit = function() {
            var generated = Templates.compileTemplate($scope.generator.template, templateVariables);

            $window.open(
                'https://reddit.com/r/' + $scope.generator.subreddit + '/submit?title=' +
                    encodeURIComponent($scope.buildTitle()) +
                    '&text=' +
                    encodeURIComponent(generated) +
                    encodeURIComponent('\n\n*^created ^using ^the [^Match ^Calendar](' + $window.location.protocol + '//' + $window.location.host + ')*'),
                '_blank');
        };
    }]);
