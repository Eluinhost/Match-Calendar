/**
 * @ngdoc service
 * @name services:GameType
 * @description
 *
 * Model for use for parsing/formatting a game
 */
class GameType {
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
    constructor(options) {
        this.name = options.name;
        this.nameLower = options.name.toLowerCase();
        this.shortCode = options.shortCode;
        this.shortCodeLower = options.shortCode.toLowerCase();
        this.description = options.description || 'No description set';
        this.requiresTeamSizes = options.requiresTeamSizes;

        this.format = (options.format || GameType.defaultFormatter).bind(this);
        this.isType = (options.isType || GameType.defaultChecker).bind(this);
    }
}

GameType.defaultChecker = function (typeString) {
    typeString = typeString.toLowerCase();
    return typeString === this.shortCodeLower || typeString === this.nameLower;
};

GameType.defaultFormatter = function (size) {
    if (this.requiresTeamSizes) {
        return `${this.shortCode}To${size}`;
    }

    return this.name;
};

export default GameType;
