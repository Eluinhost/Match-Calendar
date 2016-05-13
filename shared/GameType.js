class GameType {
    constructor({
        name,
        shortCode = name[0].toLowerCase(),
        description = 'No description set',
        requiresTeamSizes = true,
        formatter = GameType.defaultFormatter,
        isType = GameType.defaultChecker
    }) {
        this.name = name;
        this.nameLower = name.toLowerCase();
        this.shortCode = shortCode;
        this.shortCodeLower = shortCode.toLowerCase();
        this.description = description;
        this.requiresTeamSizes = requiresTeamSizes;

        this.format = formatter.bind(this);
        this.isType = isType.bind(this);
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

module.exports = GameType;
