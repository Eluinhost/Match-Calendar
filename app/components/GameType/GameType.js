'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:GameType
 * @description
 * # PostGeneratorGameType
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('GameType', ['GameTypeField', function (GameTypeField) {

        /**
         * Create a new game type
         *
         * @param {Object} options
         * @param {String} options.name - the name of the game mode
         * @param {String} options.shortCode - the code to put in the shortened version
         * @param {GameTypeField[]} [options.fields] - list of fields needed for the gamemode, default to
         *                                                          just team size field
         * @param {String} options.description - a short description of the game mode
         * @param {Function} [options.format] - optional formatter to override the default of shortCode + 'To' + size
         * @param {Function} [options.parse] - optional parser to parse fields from a formatted string the default of shortCode + 'To' + size
         * @constructor
         */
        var GameType = function(options) {
            this.name = options.name;
            this.shortCode = options.shortCode;
            this.description = options.description || 'No description set';
            this.fields = options.fields || [GameTypeField.TEAM_SIZE];
            this.format = (options.format || genericSizeFormatter).bind(this);
            this.parse = (options.parse || genericSizeParser).bind(this);
        };

        GameType.prototype.defaultValues = function() {
            return this.fields.reduce(function(acc, cur) {
                acc[cur.name] = cur.defaultValue;

                return acc;
            }, {});
        };

        // generic formatter to use with size based game types
        var genericSizeFormatter = function(fieldAnswers) {
            return this.shortCode + 'To' + fieldAnswers.size;
        };

        /**
         * Parser for a game type for sizes only, counterpart of genericSizeFormatter.
         * Returns just object for just a size field parsed from the game type string
         *
         * @param typeString
         * @returns {Object|false} false if not a match
         */
        var genericSizeParser = function(typeString) {
            // check size first
            // + 3 for 'ToX'
            if (typeString.length < this.shortCode.length + 3) return false;

            // check correct starting string
            if (typeString.substring(0, this.shortCode.length) + 'To' !== this.shortCode + 'To') return false;

            // check number, +2 for To
            var teamSize = parseInt(typeString.substring(this.shortCode.length + 2));

            if (isNaN(teamSize)) return false;

            return { size: teamSize };
        };

        GameType.types = {};

        GameType.types.FFA = new GameType({
            name: 'FFA',
            shortCode: 'FFA',
            description: 'Every man for himself.',
            fields: [],
            format: function() {
                return 'FFA';
            },
            parse: function(typeString) {
                if(typeString.trim().toLowerCase() === 'ffa') {
                    return { size: 1 };
                }

                return false;
            }
        });

        GameType.types.CHOSEN = new GameType({
            name: 'Chosen',
            shortCode: 'C',
            description: 'Players form their teams before the match.'
        });

        GameType.types.RANDOM = new GameType({
            name: 'Random',
            shortCode: 'R',
            description: 'Players are assigned random teammates.'
        });

        GameType.types.PICKED = new GameType({
            name: 'Picked',
            shortCode: 'P',
            description: 'Players take turns joining a team.'
        });

        GameType.types.CAPTAINS = new GameType({
            name: 'Captains',
            shortCode: 'Cpt',
            description: 'Selected team leaders pick their teammates.'
        });

        GameType.types.AUCTION = new GameType({
            name: 'Auction',
            shortCode: 'Auc',
            description: 'Selected team leaders buy their teammates.'
        });

        GameType.types.CUSTOM = new GameType({
            name: 'Custom',
            description: 'Custom team types',
            fields: [
                new GameTypeField({
                    question: 'What to show in post title',
                    defaultValue: 'Custom',
                    type: 'text',
                    name: 'custom'
                })
            ],
            format: function(fieldAnswers) {
                return fieldAnswers.custom;
            }
        });

        GameType.parseGameType = function(typeString) {
            for (var type in GameType.types) {
                var current = GameType.types[type];

                // skip invalid types
                if (!(current instanceof GameType)) continue;

                // skip custom if we come across it, it is used as a fallback
                if (current === GameType.types.CUSTOM) continue;

                var parsed = current.parse(typeString);

                if (parsed) {
                    return {
                        type: current,
                        data: parsed,
                        render: typeString
                    };
                }
            }

            // fallback to custom gamemode if no others parsed
            return {
                type: GameType.types.CUSTOM,
                data: {},
                render: typeString
            };
        };

        return GameType;
    }]);