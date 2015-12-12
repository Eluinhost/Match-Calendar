import template from './template.html';

function navbar() {
    return {
        restrict: 'E',
        scope: {},
        template: template
    };
}
navbar.$inject = [];

export default navbar;
