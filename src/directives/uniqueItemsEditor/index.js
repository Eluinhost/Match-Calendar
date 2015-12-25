class UniqueItemsEditorCtrl {
    constructor() {
        this.tempValue = this.tempValue || '';
        this.placeholder = this.placeholder || '';
        this.uniqueItems = this.uniqueItems || [];
    }

    addNew(valid) {
        if (!valid) {
            return;
        }

        this.uniqueItems.push(this.tempValue);
        this.tempValue = '';
    }
}

function unqiueItemsEditor() {
    return {
        scope: {
            uniqueItems: '=',
            tempValue: '=?',
            buttonPrefix: '@?',
            buttonIcon: '@',
            placeholder: '@?'
        },
        transclude: {
            requiredError: '?requiredError',
            inArrayError: '?inArrayError',
            noItems: '?noItems'
        },
        template: require('./template.html'),
        controller: UniqueItemsEditorCtrl,
        controllerAs: 'unique',
        bindToController: true
    };
}
unqiueItemsEditor.$inject = [];

export default unqiueItemsEditor;
