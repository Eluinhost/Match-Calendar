import moment from 'moment-timezone';
import _ from 'lodash';

function localTime($rootScope, DateTime, Translations) {
    return {
        restrict: 'A',
        scope: {
            time: '=relativeTime',
            from: '=?relativeTimeFrom'
        },
        link: function(scope, element, attr) {
            let showSuffix = _.isUndefined(attr.relativeTimeHideSuffix);

            function rerender() {
                element.text(
                    moment(scope.time)
                        .tz(DateTime.timeZone)
                        .locale(Translations.chosen)
                        .from(moment(scope.from || DateTime.getTime()), !showSuffix)
                );
            }

            let listeners = [
                $rootScope.$on('timeFormat', rerender),
                $rootScope.$on('language', rerender)
            ];

            if (!_.isUndefined(attr.relativeTimeTickRefresh)) {
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
