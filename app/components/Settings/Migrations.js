'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.Migrations
 * @description
 * # Migrations
 * Provider in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .provider('Migrations', function () {
        this.$get = function ($rootScope) {
            return {
                0: function () {
                    //delete the old cookies when switching to localstorage
                    var cookies = document.cookie.split(';');

                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i];
                        var eqPos = cookie.indexOf('=');
                        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    }
                },
                1: function() {
                    if($rootScope.settings.subreddits.indexOf('uhcmatches') === -1) {
                        $rootScope.settings.subreddits.push('uhcmatches');
                    }
                }
            };
        };
    });
