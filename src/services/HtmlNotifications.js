class HtmlNotifications {
    constructor($q, $window, $rootScope) {
        this.$window = $window;
        this.$q = $q;
        this.$rootScope = $rootScope;
    }

    supports() {
        return 'Notification' in this.$window;
    }

    permission() {
        if (!this.supports()) {
            return 'unsupported';
        }

        // Assumed default if none supplied (some browsers don't set the variable)
        if ('permission' in this.$window.Notification === false) {
            this.$window.Notification.permission = 'default';
        }

        // Return the window based one
        return this.$window.Notification.permission;
    }

    /**
     * @returns {promise} resolves on granted, rejects on not
     */
    requestPermission() {
        const def = this.$q.defer();

        if (this.$window.Notification.permission === 'granted') {
            def.resolve();
        } else {
            // Request the permission and update the permission value
            this.$window.Notification.requestPermission(status => {
                if (this.$window.Notification.permission !== status) {
                    this.$window.Notification.permission = status;
                }

                if (status === 'granted') {
                    def.resolve();
                } else {
                    def.reject();
                }
            });
        }

        def.promise.finally(function () {
            this.$rootScope.$broadcast('Notifications:PermissionsAsked');
        });

        return def.promise;
    }

    /**
     * @param title the title for the notification
     * @param options
     * @param body the body of the notification
     */
    notify(title = '', body = '', options = {}) {
        options.icon = options.icon || 'images/favicon.png';
        options.body = body;

        this.requestPermission()
            .then(() => new this.$window.Notification(title, options));
    }
}
HtmlNotifications.$inject = ['$q', '$window', '$rootScope'];

export default HtmlNotifications;
