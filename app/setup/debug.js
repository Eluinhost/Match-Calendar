'use strict';

(function() {

    // needs to run before bootstrap because NG_ENABLE_DEBUG_INFO is stripped during bootstrap
    var forcedDebug = /^NG_ENABLE_DEBUG_INFO!/.test(window.name);
    //  The comment is stripped out when minified making this true
    var isMinified = !/comment/.test(function () { /** comment */});

    var AppDebugInfoEnabled = forcedDebug || !isMinified;

    angular.module('MatchCalendarApp')

        .constant('debugMode', AppDebugInfoEnabled)

        .config(['$compileProvider', '$logProvider', function ($compileProvider, $logProvider) {
            // whether scopes are available for tools
            $compileProvider.debugInfoEnabled(AppDebugInfoEnabled);
            // whether logging happens on console
            $logProvider.debugEnabled(AppDebugInfoEnabled);
        }])

        .run(['$rootScope', '$log', '$interval', function ($rootScope, $log, $interval) {
            // in debug mode only log watcher counts to console
            if (!AppDebugInfoEnabled) return;

            function logWatchers() {
                var watchers = $rootScope.$$watchersCount;
                var severity;

                if (watchers.length > 2000) {
                    severity = 'error';
                } else if (watchers.length > 1200) {
                    severity = 'warn';
                } else {
                    severity = 'info';
                }

                $log[severity]('Watchers: ', watchers);
            }

            // log just after switching states
            $rootScope.$on('$stateChangeSuccess', function () {
                // run on next tick
                _.defer(logWatchers);
            });

            $interval(logWatchers, 5000);
        }]);
})();
