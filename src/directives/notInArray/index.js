import _ from 'lodash';

function notInArray() {
    return {
        require: 'ngModel',
        scope: {
            notInArray: '='
        },
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.notInArray = function(modelValue) {
                return !_.contains(scope.notInArray, modelValue);
            };
        }
    };
}
notInArray.$inject = [];

export default notInArray;
