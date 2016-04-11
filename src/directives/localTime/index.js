import moment from 'moment-timezone';
import _ from 'lodash';

function localTime($rootScope, DateTime, Translations) {
    return {
        restrict: 'A',
        scope: {
            time: '=?localTime',
            format: '@?localTimeFormat'
        },
        link: function(scope, element, attr) {
            if (_.isUndefined(attr.localTimeFormat)) {
                scope.format = 'POST_HEADER';
            }

            function time() {
                if (!scope.time) {
                    return DateTime.getTime();
                }

                if (scope.time instanceof moment) {
                    return scope.time;
                }

                return moment(scope.time);
            }

            function rerender() {
                element.text(
                    time()
                        .tz(DateTime.timeZone)
                        .locale(Translations.chosen)
                        .format(DateTime.formats[scope.format])
                );
            }

            let listeners = [
                $rootScope.$on('timeZone', rerender),
                $rootScope.$on('timeFormat', rerender),
                $rootScope.$on('language', rerender)
            ];

            if (!_.isUndefined(attr.localTimeTickRefresh)) {
                listeners.push($rootScope.$on('tick', rerender));
            }

            scope.$on('$destroy', () => listeners.forEach(l => l()));

            scope.$watch('time', rerender);
            rerender();
        }
    };
}
localTime.$inject = ['$rootScope', 'DateTime', 'Translations'];

export default localTime;
