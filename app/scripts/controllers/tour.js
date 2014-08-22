'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:TourCtrl
 * @description
 * # TourCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('TourCtrl', ['$scope', '$state', function ($scope, $state) {

        $scope.showTour = function () {
            return $state.current.name === 'list';
        };

        $scope.setTaken = function () {
            $scope.settings.tour.taken = true;
        };

        $scope.completedEvent = function () {
            $scope.setTaken();
        };
        $scope.exitEvent = function () {
            $scope.setTaken();
        };

        $scope.introOptions = {
            steps: [
                {
                    element: '.synced-time',
                    intro: 'This is the time synced with the server',
                    position: 'bottom'
                },
                {
                    element: '.picked-timezone',
                    intro: 'The selected timezone and format to show times in',
                    position: 'bottom'
                },
                {
                    element: '.last-updated',
                    intro: 'The time the list was last updated',
                    position: 'left'
                },
                {
                    element: '.refresh-icon',
                    intro: 'Force refresh the list. The list is automatically updated every minute',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .abs-game-starts',
                    intro: 'When the game starts',
                    position: 'right'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .server-address',
                    intro: 'The server address to connect to, click on it to copy it to the clipboard',
                    position: 'right'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .anchor-link',
                    intro: 'This link will go directly to this match post if it exists in the list',
                    position: 'right'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .post-title',
                    intro: 'The name of the game',
                    position: 'bottom'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .time-posted',
                    intro: 'How long ago and how far in advance the match was posted'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .post-author',
                    intro: 'The reddit name of the match host',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .fa-reddit',
                    intro: 'Click the reddit icon to add the user to your favorite hosts list',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .server-region',
                    intro: 'The region the server is hosted in',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .fa-calendar-o',
                    intro: 'Click this to enable notifications for this game, notification timings can be found on the settings page',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .game-opens',
                    intro: 'How long until the game opens',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .game-starts',
                    intro: 'How long until the game starts',
                    position: 'left'
                }
            ],
            showStepNumbers: false,
            exitOnOverlayClick: false,
            exitOnEsc: true,
            nextLabel: '<strong>Next</strong>',
            prevLabel: 'Previous',
            skipLabel: 'Exit',
            doneLabel: 'Done'
        };

        $scope.shouldAutoStart = function () {
            return false;
        };
    }]);
