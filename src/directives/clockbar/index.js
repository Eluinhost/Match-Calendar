class ClockbarCtrl {
    constructor(DateTime, DurationFormatter) {
        this.DateTime = DateTime;
        this.DurationFormatter = DurationFormatter;
    }

    timeTooltip() {
        if (this.DateTime.synced) {
            return 'Synced with server. Offset: ' + this.DurationFormatter.format(this.DateTime.offset / 1000);
        }

        return 'Time has not been synced yet';
    }

    isUsingGuessedTimezone() {
        return this.DateTime.timeZone === this.DateTime.guessedTimeZone;
    }
}
ClockbarCtrl.$inject = ['DateTime', 'DurationFormatter'];

function clockbar() {
    return {
        restrict: 'E',
        scope: {},
        template: require('./template.html'),
        controller: ClockbarCtrl,
        controllerAs: 'clockbar',
        bindToController: true
    };
}

export default clockbar;
