const GameType = require('./GameType');
const find = require('lodash/find');

const types = {
    FFA: new GameType({
        name: 'FFA',
        shortCode: 'FFA',
        requiresTeamSizes: false
    }),
    CHOSEN: new GameType({
        name: 'Chosen',
        shortCode: 'c',
        requiresTeamSizes: true,
        // Call default but also add the extra check if there is no type string to assume its a chosen teams (fallback)
        isType: typeString => GameType.defaultChecker.call(types.CHOSEN, typeString) || typeString === ''
    }),
    RANDOM: new GameType({
        name: 'Random',
        shortCode: 'r',
        requiresTeamSizes: true
    }),
    CAPTAINS: new GameType({
        name: 'Captains',
        shortCode: 'Cpt',
        requiresTeamSizes: true
    }),
    PICKED: new GameType({
        name: 'Picked',
        shortCode: 'p',
        requiresTeamSizes: true
    }),
    AUCTION: new GameType({
        name: 'SlaveMarket',
        shortCode: 'SlaveMarket',
        requiresTeamSizes: false
    }),
    MYSTERY: new GameType({
        name: 'Mystery',
        shortCode: 'm',
        requiresTeamSizes: true
    }),
    RED_VS_BLUE: new GameType({
        name: 'Red vs Blue',
        shortCode: 'RvB',
        requiresTeamSizes: false
    }),
    CUSTOM: new GameType({
        name: 'Custom',
        shortCode: 'Not required',
        requiresTeamSizes: 'CUSTOM',
        // Never use this type when parsing, it is for the generator only
        isType: () => false,
        formatter: size => size
    })
};

module.exports = {
    types,
    parseFromString: typeString => find(types, value => value.isType(typeString))
};
