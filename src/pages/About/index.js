class AboutCtrl {
    constructor() {
        this.authors = [
            {
                name: 'ghowden / Eluinhost',
                role: 'Developer/Designer',
                url: 'http://github.com/Eluinhost'
            },
            {
                name: 'Methii',
                role: 'Site icon',
                url: '#'
            }
        ];

        this.click = function(event, url) {
            if (url === '#') {
                event.preventDefault();
            }
        };
    }
}

let controllerName = 'AboutCtrl';

let state = {
    name: 'app.about',
    url: '/about',
    template: require('./template.html'),
    controller: `${controllerName} as about`
};

export { AboutCtrl as controller, controllerName, state };

export default state;
