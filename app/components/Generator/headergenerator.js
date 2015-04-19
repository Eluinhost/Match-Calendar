'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:HeadergeneratorCtrl
 * @description
 * # HeadergeneratorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('HeadergeneratorCtrl', ['$scope', '$window', '$state', '$interpolate', '$modal', '$localForage', 'HeaderGeneratorRegions', function ($scope, $window, $state, $interpolate, $modal, $localForage, HeaderGeneratorRegions) {
        $scope.regions = HeaderGeneratorRegions;

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
            region: 'NA'
        };

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

        /**
         * Updates $scope.templates.generated with the compiled version of $scope.templates.rawTemplate
         */
        $scope.updateTemplate = function() {
            $scope.templates.generated = $interpolate($scope.templates.rawTemplate, false, null, true)($scope);
        };

        /**
         * opens a new window to create a reddit post with the compiled template and info included
         */
        $scope.openReddit = function() {
            $scope.updateGenerated();
            $scope.updateTemplate();
            $window.open(
                'https://reddit.com/r/ultrahardcore/submit?title=' +
                    encodeURIComponent(
                        $scope.T.format($scope.T.formats.REDDIT_POST, $scope.opens.utc(), true) +
                        ' - ' +
                        $scope.generator.region +
                        ' - ' +
                        $scope.generator.postTitle +
                        ' - ' +
                        'TODO ADD REGIONS' // TODO
                    ) +
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
