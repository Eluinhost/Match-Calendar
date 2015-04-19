'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostGeneratorGameTypes
 * @description
 * # PostGeneratorGameTypes
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('PostGeneratorGameTypes', [function () {
        return {
            Chosen: {
                description: 'Players form their teams before the match.',
                fields: ['size'],
                format: function(fields) {
                    return 'Chosen To' + fields[0];
                }
            },
            Random: {
                description: 'Players are assigned random teammates.',
                fields: ['size'],
                format: function(fields) {
                    return 'Random To' + fields[0];
                }
            },
            Picked: {
                description: 'Players take turns joining a team.',
                fields: ['size'],
                format: function(fields) {
                    return 'Picked To' + fields[0];
                }
            },
            Mystery: {
                description: 'Players are assigned unknown teammates.',
                fields: ['size'],
                format: function(fields) {
                    return 'Mystery To' + fields[0];
                }
            },
            Captains: {
                description: 'Selected team leaders pick their teammates.',
                fields: ['captains', 'selectionMethod'],
                format: function(fields) {
                    return fields[0] + ' Captains ' + fields[1];
                }
            },
            Auction: {
                description: 'Selected team leaders buy their teammates.',
                fields: ['buyers', 'currency'],
                format: function(fields) {
                    return fields[0] + ' buyers Auction (' + fields[1] + ')';
                }
            },
            Alliances: {
                description: 'Players can form informal teams on their own.',
                fields: ['allies', 'allianceCanWin'],
                format: function(fields) {
                    return 'Alliances up to ' + fields[0] + '. Alliances can' + (fields[1] ? '', 'not') + ' win';
                }
            },
            FFA: {
                description: 'Every man for himself.',
                fields: [],
                format: function() {
                    return 'FFA';
                }
            }
        };
    }]);
