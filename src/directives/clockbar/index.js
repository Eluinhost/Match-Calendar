import template from './template.html';

function clockbar(DateTime, DurationFormatter) {
    return {
        restrict: 'E',
        scope: {},
        template: template,
        link: function(scope) {
            scope.DateTime = DateTime;

            scope.tooltip = function() {
                if (DateTime.synced) {
                    return 'Time difference to the server: ' + DurationFormatter.format(DateTime.offset / 1000);
                }

                return 'Time has not been synced yet';
            };
        }
    };
}
clockbar.$inject = ['DateTime', 'DurationFormatter'];

export default clockbar;
