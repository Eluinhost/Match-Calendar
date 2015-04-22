'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostGeneratorGameType
 * @description
 * # PostGeneratorGameType
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('PostGeneratorGameType', ['PostGeneratorGameTypeField', function (PostGeneratorGameTypeField) {

        /**
         * Create a new game type
         *
         * @param {Object} options
         * @param {String} options.name - the name of the game mode
         * @param {String} options.description - a short description of the game mode
         * @param {PostGeneratorGameTypeField[]} [options.fields] - list of fields needed for the gamemode
         * @param {Function} [options.formatter] - optional formatter to override the default
         * @constructor
         */
        var GameType = function(options) {
            this.name = options.name;
            this.description = options.description || 'No description set';
            this.fields = options.fields || [];
            this.format = options.formatter || function() { return 'ERROR CREATING GAME TYPE'; };
        };

        // generic formatter to use with size based game types
        var genericSizeFormatter = function(fieldAnswers) {
            return this.name + ' To' + fieldAnswers.size;
        };


        GameType.types = {};

        GameType.types.FFA = new GameType({
            name: 'FFA',
            description: 'Every man for himself.',
            fields: [],
            format: function() {
                return 'FFA';
            }
        });

        GameType.types.CHOSEN = new GameType({
            name: 'Chosen',
            description: 'Players form their teams before the match.',
            fields: [PostGeneratorGameTypeField.TEAM_SIZE],
            format: genericSizeFormatter
        });

        GameType.types.RANDOM = new GameType({
            name: 'Random',
            description: 'Players are assigned random teammates.',
            fields: [PostGeneratorGameTypeField.TEAM_SIZE],
            format: genericSizeFormatter
        });

        GameType.types.PICKED = new GameType({
            name: 'Picked',
            description: 'Players take turns joining a team.',
            fields: [PostGeneratorGameTypeField.TEAM_SIZE],
            format: genericSizeFormatter
        });

        GameType.types.MYSTERY = new GameType({
            name: 'Mystery',
            description: 'Players are assigned unknown teammates.',
            fields: [PostGeneratorGameTypeField.TEAM_SIZE],
            format: genericSizeFormatter
        });

        GameType.types.CAPTAINS = new GameType({
            name: 'Captains',
            description: 'Selected team leaders pick their teammates.',
            fields: [
                new PostGeneratorGameTypeField({
                    question: 'Number of captains',
                    defaultValue: 4,
                    type: 'number',
                    name: 'captains'
                }),
                new PostGeneratorGameTypeField({
                    question: 'Selection Method',
                    defaultValue: '',
                    name: 'selection'
                })
            ],
            format: function(fieldAnswers) {
                return fieldAnswers.captains + ' Captains ' + fieldAnswers.selection;
            }
        });

        GameType.types.AUCTION = new GameType({
            name: 'Auction',
            description: 'Selected team leaders buy their teammates.',
            fields: [
                new PostGeneratorGameTypeField({
                    question: 'Number of buyers',
                    defaultValue: 4,
                    type: 'number',
                    name: 'buyers'
                }),
                new PostGeneratorGameTypeField({
                    question: 'Currency',
                    defaultValue: 'diamonds',
                    type: 'text',
                    name: 'currency'
                })
            ],
            format: function(fieldAnswers) {
                return fieldAnswers.buyers + ' buyers Auction (' + fieldAnswers.currency;
            }
        });

        GameType.types.ALLIANCES = new GameType({
            name: 'Alliance',
            description: 'Players can form informal teams on their own.',
            fields: [
                new PostGeneratorGameTypeField({
                    question: 'Max amount of players for an alliance',
                    defaultValue: 8,
                    type: 'number',
                    name: 'max'
                }),
                new PostGeneratorGameTypeField({
                    question: 'Can alliances win?',
                    defaultValue: true,
                    type: 'checkbox',
                    name: 'canWin'
                })
            ],
            format: function(fieldAnswers) {
                return 'Alliances up to ' + fieldAnswers.max + '. Alliances can' + (fieldAnswers.canWin ? '' : 'not') + ' win';
            }
        });

        GameType.types.CUSTOM = new GameType({
            name: 'Custom',
            description: 'Custom team types',
            fields: [
                new PostGeneratorGameTypeField({
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

        return GameType;
    }]);
