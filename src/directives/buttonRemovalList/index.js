class ButtonRemovalListCtrl {
    constructor() {
        this.itemPrefix = this.itemPrefix || '';
        this.items = [];
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.ngModelCtrl.$setViewValue(this.items);
    }

    init() {
        this.ngModelCtrl.$render = () => this.items = this.ngModelCtrl.$viewValue;
    }
}

function buttonRemovalList() {
    return {
        require: 'ngModel',
        scope: {
            buttonIcon: '@',
            buttonPrefix: '@?'
        },
        template: require('./template.html'),
        link: function(scope, elem, attr, ngModelCtrl) {
            scope.removal.ngModelCtrl = ngModelCtrl;
            scope.removal.init();
        },
        controller: ButtonRemovalListCtrl,
        controllerAs: 'removal',
        bindToController: true
    };
}
buttonRemovalList.$inject = [];

export default buttonRemovalList;
