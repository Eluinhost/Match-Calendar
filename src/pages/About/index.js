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
                role: 'Art',
                url: '#'
            }
        ];

        this.types = {
            FONT: 'Font',
            JS: 'Javascript Library',
            CSS: 'CSS Library'
        };

        this.libraries = _.sortBy([
            {
                name: 'Hammersmith One',
                type: this.types.FONT,
                url: 'https://www.google.com/fonts/specimen/Hammersmith+One',
                license: {
                    name: 'SIL Open Font License, 1.1',
                    url: 'http://scripts.sil.org/OFL'
                }
            },
            {
                name: 'Fontawesome',
                type: this.types.FONT,
                url: 'https://fortawesome.github.io/Font-Awesome/',
                license: {
                    name: 'SIL OFL 1.1 (Font) + MIT (Code)',
                    url: 'https://fortawesome.github.io/Font-Awesome/license/'
                }
            },
            {
                name: 'AngularJS',
                type: this.types.JS,
                url: 'https://angularjs.org/',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/angular/angular.js/master/LICENSE'
                }
            },
            {
                name: 'angular-bindonce',
                type: this.types.JS,
                url: 'https://github.com/Pasvaz/bindonce',
                license: {
                    name: 'MIT',
                    url: 'https://github.com/Pasvaz/bindonce#license---mit-license'
                }
            },
            {
                name: 'angular-elastic',
                type: this.types.JS,
                url: 'https://github.com/monospaced/angular-elastic',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/monospaced/angular-elastic/master/LICENCE.txt'
                }
            },
            {
                name: 'angular-localforage',
                type: this.types.JS,
                url: 'https://github.com/ocombe/angular-localForage',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/ocombe/angular-localForage/master/LICENSE.md'
                }
            },
            {
                name: 'angular-truncate-2',
                type: this.types.JS,
                url: 'https://github.com/BernardoSilva/angular-truncate-2',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/BernardoSilva/angular-truncate-2/master/LICENSE'
                }
            },
            {
                name: 'angular-ui-bootstrap',
                type: this.types.JS,
                url: 'https://github.com/angular-ui/bootstrap',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/angular-ui/bootstrap/master/LICENSE'
                }
            },
            {
                name: 'angular-ui-router',
                type: this.types.JS,
                url: 'https://github.com/angular-ui/ui-router',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/angular-ui/ui-router/master/LICENSE'
                }
            },
            {
                name: 'angularjs-slider',
                type: this.types.JS,
                url: 'https://github.com/angular-slider/angularjs-slider',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/angular-slider/angularjs-slider/master/LICENSE'
                }
            },
            {
                name: 'Bootstrap v4',
                type: this.types.CSS,
                url: 'https://github.com/twbs/bootstrap/tree/v4-dev',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/twbs/bootstrap/v4-dev/LICENSE'
                }
            },
            {
                name: 'clipboard.js',
                type: this.types.JS,
                url: 'https://github.com/zenorocha/clipboard.js',
                license: {
                    name: 'MIT',
                    url: 'http://zenorocha.mit-license.org/'
                }
            },
            {
                name: 'he',
                type: this.types.JS,
                url: 'https://github.com/mathiasbynens/he',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/mathiasbynens/he/master/LICENSE-MIT.txt'
                }
            },
            {
                name: 'localforage',
                type: this.types.JS,
                url: 'https://github.com/mozilla/localForage',
                license: {
                    name: 'Apache 2.0',
                    url: 'https://raw.githubusercontent.com/mozilla/localForage/master/LICENSE'
                }
            },
            {
                name: 'lodash',
                type: this.types.JS,
                url: 'https://github.com/lodash/lodash',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/lodash/lodash/master/LICENSE'
                }
            },
            {
                name: 'moment-timezone',
                type: this.types.JS,
                url: 'https://github.com/moment/moment-timezone/',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/moment/moment-timezone/develop/LICENSE'
                }
            },
            {
                name: 'ngclipboard',
                type: this.types.JS,
                url: 'https://github.com/sachinchoolur/ngclipboard',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/sachinchoolur/ngclipboard/master/LICENSE'
                }
            },
            {
                name: 'outdated-browser',
                type: this.types.JS,
                url: 'https://github.com/burocratik/outdated-browser',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/burocratik/outdated-browser/develop/LICENSE'
                }
            },
            {
                name: 'snuownd',
                type: this.types.JS,
                url: 'https://github.com/gamefreak/snuownd',
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT'
                }
            }
        ], item => item.name.toLowerCase());

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
