'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:GameType
 * @description
 * # PostGeneratorGameType
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('GameType', [function () {

        /**
         * Create a new game type
         *
         * @param {Object} options
         * @param {String} options.name - the name of the game mode
         * @param {String} options.shortCode - the code to put in the shortened version
         * @param {Boolean} options.requiresTeamSizes - whether the game type requires sizes or not
         * @param {String} options.description - a short description of the game mode
         * @param {Function} [options.format] - optional formatter to override the default
         * @param {Function} [options.isType] - optional checker to override the default
         * @constructor
         */
        var GameType = function(options) {
            this.name = options.name;
            this.shortCode = options.shortCode;
            this.description = options.description || 'No description set';
            this.requiresTeamSizes = options.requiresTeamSizes;

            this.format = (options.format || defaultFormatter).bind(this);
            this.isType = (options.isType || defaultChecker).bind(this);
        };

        var defaultFormatter = function(size) {
            if (this.requiresTeamSizes) {
                return this.shortCode + 'To' + size;
            } else {
                return this.name;
            }
        };

        var defaultChecker = function(typeString) {
            return typeString === this.shortCode || typeString === this.name;
        };

        GameType.types = {};

        GameType.types.FFA = new GameType({
            name: 'FFA',
            shortCode: 'FFA',
            description: 'Every man for himself.',
            requiresTeamSizes: false
        });

        GameType.types.CHOSEN = new GameType({
            name: 'Chosen',
            shortCode: 'c',
            description: 'Players form teams before the match',
            requiresTeamSizes: true,
            isType: function(typeString) {
                // call default but also add the extra check if there is no type string to assume its a chosen teams
                return defaultChecker.call(this, typeString) || typeString === '';
            }
        });

        GameType.types.RANDOM = new GameType({
            name: 'Random',
            shortCode: 'r',
            description: 'Players are assigned random teammates',
            requiresTeamSizes: true
        });

        GameType.types.PICKED = new GameType({
            name: 'Picked',
            shortCode: 'p',
            description: 'Players take turns joining a team.',
            requiresTeamSizes: true
        });

        GameType.types.CAPTAINS = new GameType({
            name: 'Captains',
            shortCode: 'Cpt',
            description: 'Selected team leaders pick their teammates.',
            requiresTeamSizes: true
        });

        GameType.types.AUCTION = new GameType({
            name: 'SlaveMarket',
            shortCode: 'SlaveMarket',
            description: 'Selected team leaders buy their teammates.',
            requiresTeamSizes: false
        });

        GameType.types.CUSTOM = new GameType({
            name: 'Custom',
            shortCode: 'Not required',
            description: 'Add a custom game style',
            requiresTeamSizes: 'CUSTOM',
            isType: function() {
                // never use this type when parsing, it is for the generator only
                return false;
            },
            format: function(size) {
                return size;
            }
        });

        GameType.parseGameType = function(typeString) {
            for (var type in GameType.types) {
                var current = GameType.types[type];

                // skip invalid types
                if (!(current instanceof GameType)) continue;

                if (current.isType(typeString)) {
                    return current;
                }
            }

            // fallback to custom gamemode if no others parsed
            return null;
        };

        return GameType;
    }]);
