import template from './template.html';
import logo from 'app/images/logo.png';

function headerBar() {
    return {
        restrict: 'E',
        scope: {},
        template: template,
        link: function(scope) {
            scope.logoURL = logo;
        }
    };
}
headerBar.$inject = [];

export default headerBar;
