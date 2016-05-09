import GameType from 'app/services/GameType';
import _ from 'lodash';

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
        // Call default but also add the extra check if there is no type string to assume its a chosen teams
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
    CUSTOM: new GameType({
        name: 'Custom',
        shortCode: 'Not required',
        requiresTeamSizes: 'CUSTOM',
        // Never use this type when parsing, it is for the generator only
        isType: () => false,
        format: size => size
    })
};

function parseGameType(typeString) {
    return _.find(types, value => value.isType(typeString));
}

export default types;

export { types, parseGameType };
