import GameType from 'app/services/GameType';
import {defaultChecker} from 'app/services/GameType';
import _ from 'lodash';

const types = {
    FFA: new GameType({
        name: 'FFA',
        shortCode: 'FFA',
        description: 'Every man for himself.',
        requiresTeamSizes: false
    }),
    CHOSEN: new GameType({
        name: 'Chosen',
        shortCode: 'c',
        description: 'Players form teams before the match',
        requiresTeamSizes: true,
        // Call default but also add the extra check if there is no type string to assume its a chosen teams
        isType: function(typeString) {
            return defaultChecker.call(this, typeString) || typeString === '';
        }
    }),
    RANDOM: new GameType({
        name: 'Random',
        shortCode: 'r',
        description: 'Players are assigned random teammates',
        requiresTeamSizes: true
    }),
    CAPTAINS: new GameType({
        name: 'Captains',
        shortCode: 'Cpt',
        description: 'Selected team leaders pick their teammates.',
        requiresTeamSizes: true
    }),
    PICKED: new GameType({
        name: 'Picked',
        shortCode: 'p',
        description: 'Players take turns joining a team.',
        requiresTeamSizes: true
    }),
    AUCTION: new GameType({
        name: 'SlaveMarket',
        shortCode: 'SlaveMarket',
        description: 'Selected team leaders buy their teammates.',
        requiresTeamSizes: false
    }),
    MYSTERY: new GameType({
        name: 'Mystery',
        shortCode: 'm',
        description: 'Mystery teams',
        requiresTeamSizes: true
    }),
    CUSTOM: new GameType({
        name: 'Custom',
        shortCode: 'Not required',
        description: 'Add a custom game style',
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
