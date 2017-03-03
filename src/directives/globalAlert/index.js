import template from './template.html';

class GlobalAlertCtrl {
    constructor($http, $interval) {
        this.$http = $http;
        this.url = require('!!file!app/../alert.md');
        this.markdown = null;

        $interval(() => this.update(), 2 * 60 * 1000);
        this.update();
    }

    update() {
        this.$http.get(this.url)
            .success(data => {
                this.markdown = data;
            })
            .catch(() => {
                this.markdown = null;
            });
    }

}
GlobalAlertCtrl.$inject = ['$http', '$interval'];

/**
 * @ngdoc directive
 * @name directive:globalAlert
 * @description Shows any global alerts from the alert.md server file
 */
function globalAlert() {
    return {
        restrict: 'E',
        template,
        scope: {},
        controller: GlobalAlertCtrl,
        controllerAs: 'alert',
        bindToController: true
    };
}
globalAlert.$inject = [];

export default globalAlert;
