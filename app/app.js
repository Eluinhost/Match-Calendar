'use strict';

// Main application
angular.module('MatchCalendarApp', ['truncate', 'ui.bootstrap', 'LocalForageModule', 'monospaced.elastic', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable', 'pasvaz.bindonce'])

    .run(function(editableOptions,
        // eager load some services that we want to run
        Posts, PostNotifications, DateTimeService // jshint ignore:line
        ){
        editableOptions.theme = 'bs3';
    })

    //configuration
    .config(['$stateProvider', '$urlRouterProvider', '$localForageProvider', function($stateProvider, $urlRouterProvider, $localForageProvider) {
        $localForageProvider.config({
            name: 'MatchCalendar'
        });

        $stateProvider
            .state('list', {
                url: '/list?post',
                templateUrl: 'components/PostList/list.html',
                controller: 'PostListCtrl'
            })

            .state('listhelp', {
                url: '/list/help',
                templateUrl: 'components/PostList/listhelp.html',
                controller: 'PostListHelpCtrl'
            })

            .state('generate', {
                url: '/generate',
                templateUrl: 'components/Generator/generator.html',
                controller: 'PostGeneratorCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'components/Settings/settings.html',
                controller: 'SettingsCtrl'
            })

            .state('editor', {
                url: '/editor',
                templateUrl: 'components/TemplateEditor/TemplateEditor.html',
                controller: 'TemplateEditorCtrl'
            })

            .state('about', {
                url: '/about',
                templateUrl: 'components/About/about.html',
                controller: 'AboutCtrl'
            });

        $urlRouterProvider.otherwise('/list');
    }]);
