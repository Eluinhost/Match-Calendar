'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:GameTypeField
 * @description
 * # GameTypeField
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('GameTypeField', [function () {

        /**
         * Creates a new field for the game type
         *
         * @param {Object} options
         * @param {String} options.name - the name of the field for the result object
         * @param {String} options.question - the quesiton to attribute to the question
         * @param {*} options.defaultValue - the initial value to show when shown
         * @param {String} [options.type='text'] - the type of field to render
         * @constructor
         */
        var Field = function(options) {
            this.name = options.name;
            this.question = options.question || 'No question set';
            this.defaultValue = options.defaultValue;
            this.type = options.type || 'text';
        };

        // add a simple reusable field that many can use
        Field.TEAM_SIZE = new Field({
            question: 'Players per team',
            defaultValue: 4,
            type: 'number',
            name: 'size'
        });

        return Field;
    }]);
