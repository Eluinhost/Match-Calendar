import _ from 'lodash';

function notInArray() {
    return {
        require: 'ngModel',
        scope: {
            notInArray: '=',
            notInArrayCaseSensitive: '=?'
        },
        link: (scope, elm, attrs, ctrl) => {
            ctrl.$validators.notInArray = function (modelValue) {
                if (scope.notInArrayCaseSensitive) {
                    return !_.includes(scope.notInArray, modelValue);
                }

                const check = modelValue.toLowerCase();
                return !_.some(scope.notInArray, item => item.toLowerCase() === check);
            };
        }
    };
}
notInArray.$inject = [];

export default notInArray;
