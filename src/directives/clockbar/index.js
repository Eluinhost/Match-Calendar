class ClockbarCtrl {
    constructor(DateTime, DurationFormatter, Translations) {
        this.DateTime = DateTime;
        this.DurationFormatter = DurationFormatter;
        this.Translations = Translations;
    }

    formattedOffset() {
        return this.DurationFormatter.format(this.DateTime.offset / 1000);
    }

    timeTooltip() {
        return this.DateTime.synced ? 'clockbar.synced' : 'clockbar.unsynced';
    }

    isUsingGuessedTimezone() {
        return this.DateTime.timeZone === this.DateTime.guessedTimeZone;
    }
}
ClockbarCtrl.$inject = ['DateTime', 'DurationFormatter', 'Translations'];

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
