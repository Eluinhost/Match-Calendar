'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.HtmlNotifications
 * @description
 * # HtmlNotifications
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('HtmlNotifications', ['$q', '$window', function ($q, $window) {
        return {
            /**
             * @returns boolean true if notification available, false otherwise
             */
            supports: function () {
                return 'Notification' in $window;
            },
            currentPermission: function () {
                if(!this.supports()) {
                    return 'unsupported';
                }

                if ('permission' in $window.Notification === false) {
                    $window.Notification.permission = 'default';
                }

                return $window.Notification.permission;
            },
            /**
             * @returns {promise} resolves on granted, rejects on not
             */
            requestPermission: function () {
                var def = $q.defer();
                if ($window.Notification.permission !== 'granted') {
                    //request the permission and update the permission value
                    $window.Notification.requestPermission(function (status) {
                        if ($window.Notification.permission !== status) {
                            $window.Notification.permission = status;
                        }
                        if(status === 'granted') {
                            def.resolve();
                        } else {
                            def.reject();
                        }
                    });
                } else {
                    def.resolve();
                }
                return def.promise;
            },
            /**
             * @param title the title for the notification
             * @param options
             * @param body the body of the notification
             */
            notify: function (title, body, options) {
                this.requestPermission().then(function () {
                    options = options || [];
                    options.icon = options.icon || 'images/favicon.png';
                    options.body = body || '';

                    new $window.Notification(title, options);
                });
            }
        };
    }]);
