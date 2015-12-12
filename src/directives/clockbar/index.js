import template from './template.html';

function clockbar(DateTime) {
    return {
        restrict: 'E',
        scope: {},
        template: template,
        link: function(scope) {
            scope.DateTime = DateTime;
        }
    };
}
clockbar.$inject = ['DateTime'];

export default clockbar;
