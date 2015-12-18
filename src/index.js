import 'app/main.sass';
import _ from 'lodash';

// Add mixin for lodash
_.mixin({
    mergeNotNull: function(object, ...sources) {
        // Convert all nulls to undefined
        sources.forEach(source => _.mapValues(source, value => _.isNull(value) ? undefined : value));
        // Run a regular merge
        _.merge(object, ...sources);
    }
});

// Registered as a global, capture export
import outdatedBrowser  from 'imports?outdatedBrowser=>{}!exports?outdatedBrowser!outdated-browser';

outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'borderImage',
    languagePath: ''
});

// 3rd party
import angular   from 'angular';
import bootstrap from 'angular-ui-bootstrap';
import elastic   from 'angular-elastic';
import sanitize  from 'angular-sanitize';
import router    from 'angular-ui-router';
import animate   from 'angular-animate';
import messages  from 'angular-messages';
import {name as slider} from 'angularjs-slider';

// 3rd party, don't expose names
import 'angular-localForage'; const angularLocalForage = 'LocalForageModule';
import 'ng-clip';             const clipboard = 'ngClipboard';
import 'angular-bindonce';    const bindonce = 'pasvaz.bindonce';
import 'angular-truncate-2';  const truncate = 'truncate';


// Configs
import q           from 'app/setup/q';
import bs3         from 'app/setup/bs3';
import localForage from 'app/setup/localForage';
import debugInfo   from 'app/setup/debugInfo';

// Runs
import watcherLog  from 'app/setup/watcherLog';

// Services
import Changelog          from 'app/services/Changelog';
import DateTime           from 'app/services/DateTime';
import DurationFormatter  from 'app/services/DurationFormatter';
import PostNotifications  from 'app/services/PostNotifications';
import Hosts              from 'app/services/Hosts';
import HtmlNotifications  from 'app/services/HtmlNotifications';
import MatchPostParser    from 'app/services/MatchPostParser';
import Posts              from 'app/services/Posts';
import RedditPostsService from 'app/services/RedditPostsService';
import Subreddits         from 'app/services/Subreddits';
import Templates          from 'app/services/Templates';

// Directives
import appCacheUpdater            from 'app/directives/appCacheUpdater';
import dateTimePicker             from 'app/directives/dateTimePicker';
import desktopNotificationEnabler from 'app/directives/desktopNotificationEnabler';
import markdown                   from 'app/directives/markdown';
import keybind                    from 'app/directives/keybind';
import postDetails                from 'app/directives/postDetails';
import headerBar                  from 'app/directives/headerBar';
import footerBar                  from 'app/directives/footerBar';
import navbar                     from 'app/directives/navbar';
import clockbar                   from 'app/directives/clockbar';
import notInArray                 from 'app/directives/notInArray';
import buttonRemovalList          from 'app/directives/buttonRemovalList';
import uniqueItemsEditor          from 'app/directives/uniqueItemsEditor';

// Pages/Controllers
import * as About          from 'app/pages/About';
import * as Generator      from 'app/pages/Generator';
import * as TemplateEditor from 'app/pages/TemplateEditor';
import * as Post           from 'app/pages/Post';
import * as PostList       from 'app/pages/PostList';
import * as Help           from 'app/pages/PostList/Help';
import * as Settings       from 'app/pages/Settings';
import * as Title          from 'app/pages/global/TitleCtrl';

let pages = [About, Generator, TemplateEditor, PostList, Help, Settings, Title, Post];

function setupStates($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
        resolve: {
            // All routes require DateTime to be loaded before continuing
            savedData: ['DateTime', function(DateTime) {
                return DateTime.initialised;
            }]
        }
    });

    pages
        .filter(page => !_.isUndefined(page.state))
        .map(page => page.state)
        .forEach(state => $stateProvider.state(state));

    $urlRouterProvider.otherwise(PostList.state.url);
}
setupStates.$inject = ['$stateProvider', '$urlRouterProvider'];

let app = angular.module(
    'MatchCalendarApp',
    [angularLocalForage, elastic, sanitize, router, clipboard, animate, bindonce, bootstrap, truncate, slider, messages]
)
    .config(q)
    .config(bs3)
    .config(localForage)
    .config(debugInfo)
    .config(setupStates)
    .run(watcherLog)
    .directive('appCacheUpdater', appCacheUpdater)
    .directive('dateTimePicker', dateTimePicker)
    .directive('desktopNotificationEnabler', desktopNotificationEnabler)
    .directive('markdown', markdown)
    .directive('keybind', keybind)
    .directive('postDetails', postDetails)
    .directive('headerBar', headerBar)
    .directive('footerBar', footerBar)
    .directive('navbar', navbar)
    .directive('clockbar', clockbar)
    .directive('notInArray', notInArray)
    .directive('buttonRemovalList', buttonRemovalList)
    .directive('uniqueItemsEditor', uniqueItemsEditor)
    .service('Changelog', Changelog)
    .service('DateTime', DateTime)
    .service('DurationFormatter', DurationFormatter)
    .service('PostNotifications', PostNotifications)
    .service('Hosts', Hosts)
    .service('HtmlNotifications', HtmlNotifications)
    .service('MatchPostParser', MatchPostParser)
    .service('Posts', Posts)
    .service('RedditPostsService', RedditPostsService)
    .service('Subreddits', Subreddits)
    .service('Templates', Templates);

pages
    .filter(page => !_.isUndefined(page.controller) && !_.isUndefined(page.controllerName))
    .forEach(page => app.controller(page.controllerName, page.controller));
