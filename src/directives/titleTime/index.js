class TitleTimeCtrl {
    constructor(DateTime) {
        this.DateTime = DateTime;

        this.loaded = false;

        this.DateTime.initialised.then(() => this.loaded = true);
    }

    generate() {
        return this.loaded ? this.DateTime.format('TITLE') + ' - Calendar' : 'Loading...';
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
