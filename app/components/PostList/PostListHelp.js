'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostListHelpCtrl
 * @description
 * # PostListHelpCtrl
 * Controller in MatchCalendar
 */
angular.module('MatchCalendarApp')
    .controller('PostListHelpCtrl', ['$scope', 'DateTimeService', function ($scope, DateTimeService) {
        $scope.DateTime = DateTimeService;

        $scope.example = {
            id: 'examplepost',
            title: 'Example Post',
            selftext: 'Content of Reddit post will show up here',
            author: 'ghowden',
            permalink: '#',
            posted: moment().subtract(2, 'hours'),
            opens: moment().add(2, 'hours'),
            anchorlink: '#',
            address: '192.168.0.1',
            region: 'EU',
            teams: 'Chosen To4',
            gamemodes: ['Vanilla+', 'Hardcore']
        };
    }]);
