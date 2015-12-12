import template from './template.html';

function footerBar() {
    return {
        restrict: 'E',
        scope: {},
        template: template
    };
}
footerBar.$inject = [];

export default footerBar;
