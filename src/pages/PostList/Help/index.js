import moment from 'moment-timezone';

class HelpCtrl {
    constructor(DateTime) {
        this.DateTime = DateTime;
        this.example = {
            id: 1,
            author: 'ghowden',
            opens: moment('2017-08-05T17:45:22Z'),
            address: 'example.com',
            ip: '127.0.0.1:54444',
            scenarios: ['Vanilla+', 'CutClean'],
            tags: ['Test Tag', 'ArcticUHC'],
            teams: 'captains',
            size: 10,
            customStyle: null,
            count: 56,
            content: 'Enter **markdown** content here',
            region: 'OC',
            removed: false,
            removedBy: null,
            removedReason: null,
            created: moment('2017-07-20T17:11:18.740Z'),
            roles: ['moderator', 'trial']
        };
        //
        // this.example = {
        //     id: 'examplepost',
        //     title: 'Example Post',
        //     selftext: 'Content of Reddit post will show up here',
        //     author: 'ghowden',
        //     permalink: '#',
        //     posted: moment().subtract(2, 'hours'),
        //     opens: moment().add(2, 'hours'),
        //     address: '192.168.0.1',
        //     region: 'EU',
        //     teams: 'Chosen To4',
        //     gamemodes: ['Vanilla+', 'Hardcore']
        // };
    }
}
HelpCtrl.$inject = ['DateTime'];

const controllerName = 'HelpCtrl';

const state = {
    name: 'app.listhelp',
    url: '/list/help',
    template: require('./template.html'),
    controller: `${controllerName} as help`
};

export { HelpCtrl as controller, controllerName, state };

export default state;
