import template from './template.html';

function countryFlag() {
    return {
        restrict: 'AE',
        scope: {
            countryCode: '='
        },
        template: template
    };
}
countryFlag.$inject = [];

export default countryFlag;
