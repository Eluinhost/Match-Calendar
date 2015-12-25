import _ from 'lodash';

function notInArray() {
    return {
        require: 'ngModel',
        scope: {
            notInArray: '=',
            notInArrayCaseSensitive: '=?'
        },
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.notInArray = function(modelValue) {
                if (scope.notInArrayCaseSensitive) {
                    return !_.contains(scope.notInArray, modelValue);
                }

                let check = modelValue.toLowerCase();
                return !_.any(scope.notInArray, item => item.toLowerCase() === check);
            };
        }
    };
}
notInArray.$inject = [];

export default notInArray;
