'use strict';

angular.module('MatchCalendarApp')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
