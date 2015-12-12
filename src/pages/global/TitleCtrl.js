class TitleCtrl {
    constructor(DateTime) {
        this.DateTime = DateTime;
    }
}
TitleCtrl.$inject = ['DateTime'];

let controllerName = 'TitleCtrl';

export { TitleCtrl as controller, controllerName };
