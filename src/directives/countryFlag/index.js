import template from './template.html';

function countryFlag() {
    return {
        restrict: 'AE',
        scope: {
            countryCode: '='
        },
        template
    };
}
countryFlag.$inject = [];

export default countryFlag;
