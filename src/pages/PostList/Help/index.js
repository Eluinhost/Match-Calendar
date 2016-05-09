import moment from 'moment-timezone';

class HelpCtrl {
    constructor(DateTime) {
        this.DateTime = DateTime;
        this.example = {
            id: 'examplepost',
            title: 'Example Post',
            selftext: 'Content of Reddit post will show up here',
            author: 'ghowden',
            permalink: '#',
            posted: moment().subtract(2, 'hours'),
            opens: moment().add(2, 'hours'),
            anchorlink: '#',
            address: '192.168.0.1',
            region: 'EU',
            teams: 'Chosen To4',
            gamemodes: ['Vanilla+', 'Hardcore'],
            isStartTime: true
        };
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
