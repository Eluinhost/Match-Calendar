'use strict';

// Main application
angular.module('MatchCalendarApp', ['truncate', 'ui.bootstrap', 'LocalForageModule', 'monospaced.elastic', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable', 'pasvaz.bindonce'])

    .run(function($rootScope, $localForage, editableOptions, $q, $window, $modal,
        // eager load some services that we want to run
        Posts, PostNotifications, DateTimeService // jshint ignore:line
        ){
        editableOptions.theme = 'bs3';

        $rootScope.showChangelog = function() {
            $modal.open({
                template: '<div class="modal-header"><h3 class="modal-title">Changelog</h3></div><div class="modal-body"><markdown class="md" content="markdown"></markdown></div>',
                controller: function($scope, $http) {
                    $scope.markdown = '';

                    $http.get('/changelog.md').success(function(data) {
                        $scope.markdown = data;
                    }).error(function() {
                        $scope.markdown = 'Error loading changelog data';
                    });
                }
            });
        };

        //check appcache status
        if(angular.isDefined($window.applicationCache)) {

            var onUpdateReady = function() {
                $modal.open({
                    template: '<div class="modal-header"><h3 class="modal-title">An update is ready, reload?</h3></div><div class="modal-body"><button class="btn btn-warning" type="button" ng-click="reload()">Reload Now</button><button class="btn btn-info" type="button" ng-click="showChangelog()">Changelog</button></div>',
                    controller: function($scope, $window) {
                        $scope.reload = function() {
                            $window.location.reload();
                        };
                    }
                });
            };

            $window.applicationCache.addEventListener('updateready', onUpdateReady);
            if ($window.applicationCache.status === $window.applicationCache.UPDATEREADY) {
                onUpdateReady();
            }
        }
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
