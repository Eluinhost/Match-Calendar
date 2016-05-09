import DebugMode from 'app/services/DebugMode';
import _ from 'lodash';

function watcherLog($rootScope, $log, $interval) {
    // In debug mode only log watcher counts to console
    if (!DebugMode) {
        return;
    }

    let lastCount = 0;

    function logWatchers() {
        const watchers = $rootScope.$$watchersCount;
        let severity;

        if (watchers.length > 1600) {
            severity = 'error';
        } else if (watchers.length > 800) {
            severity = 'warn';
        } else {
            severity = 'info';
        }

        if (watchers !== lastCount) {
            lastCount = watchers;
            $log[severity]('Watchers: ', watchers);
        }
    }

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
        $log.info('From: ', fromState.name, 'To: ', toState.name);
        // Log just after switching states
        _.defer(logWatchers);
    });

    // Recheck on interval
    $interval(logWatchers, 5000);
}
watcherLog.$inject = ['$rootScope', '$log', '$interval'];

export default watcherLog;
