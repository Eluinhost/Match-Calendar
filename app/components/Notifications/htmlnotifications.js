'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.HtmlNotifications
 * @description
 * # HtmlNotifications
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('HtmlNotifications', function ($q, $window, $rootScope) {
        var supports = function() {
            return 'Notification' in $window;
        };

        return {
            /**
             * @returns boolean true if notification available, false otherwise
             */
            supports: supports,
            /**
             * Small changes to the window based version
             *
             * 'unsupported', 'default', 'denied' and 'granted'
             */
            get permission() {
                if(!supports()) {
                    return 'unsupported';
                }

                // assumed default if none supplied (some browsers don't set the variable)
                if ('permission' in $window.Notification === false) {
                    $window.Notification.permission = 'default';
                }

                // return the window based one
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
                def.promise.finally(function() {
                    $rootScope.$broadcast('Notifications:PermissionsAsked');
                });
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
    });
