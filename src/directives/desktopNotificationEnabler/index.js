class NotificationEnablerCtrl {
    constructor(HtmlNotifications) {
        this.HtmlNotifications = HtmlNotifications;
    }

    requestPermission() {
        return this.HtmlNotifications
            .requestPermission()
            .then(() => this.HtmlNotifications.notify('Notifications Enabled!'));
    }
}
NotificationEnablerCtrl.$inject = ['HtmlNotifications'];

function desktopNotificationEnabler() {
    return {
        restrict: 'E',
        template: require('./template.html'),
        scope: {},
        controller: NotificationEnablerCtrl,
        controllerAs: 'enabler',
        bindToController: true
    };
}

export default desktopNotificationEnabler;
