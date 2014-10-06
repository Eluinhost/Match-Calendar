'use strict';

/**
 * @ngdoc service
 * @name matchCalendarApp.HtmlNotifications
 * @description
 * # HtmlNotifications
 * Factory in the matchCalendarApp.
 */
angular.module('matchCalendarApp')
    .factory('HtmlNotifications', ['$q', function ($q) {
        return {
            /**
             * @returns boolean true if notification available, false otherwise
             */
            supports: function () {
                return 'Notification' in window;
            },
            currentPermission: function () {
                if(!this.supports()) {
                    return 'unsupported';
                }

                if (! 'permission' in Notification) {
                    Notification.permission = 'default';
                }

                return Notification.permission;
            },
            /**
             * @returns {promise} resolves on granted, rejects on not
             */
            requestPermission: function () {
                var def = $q.defer();
                if (Notification.permission !== 'granted') {
                    //request the permission and update the permission value
                    Notification.requestPermission(function (status) {
                        if (Notification.permission !== status) {
                            Notification.permission = status;
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

                    new Notification(title, options);
                });
            }
        };
    }]);
