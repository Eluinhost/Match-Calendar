class TitleTimeCtrl {
    constructor(DateTime) {
        this.DateTime = DateTime;

        this.loaded = false;

        this.DateTime.initialised.then(() => {
            this.loaded = true;
        });
    }

    generate() {
        if (!this.loaded) {
            return 'Loading...';
        }

        return `${this.DateTime.format('TITLE')} - Calendar`;
    }
}
TitleTimeCtrl.$inject = ['DateTime'];

function postDetails() {
    return {
        restrict: 'E',
        scope: {},
        template: require('./template.html'),
        controller: TitleTimeCtrl,
        controllerAs: 'title',
        bindToController: true
    };
}

export default postDetails;
