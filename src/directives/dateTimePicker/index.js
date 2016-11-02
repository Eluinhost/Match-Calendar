import moment from 'moment-timezone';
import template from './template.html';

class DateTimePickerCtrl {
    constructor($scope) {
        this.opened = false;
        this.internalJSDate = this.pickedDate.toDate();
        this.internalMinDate = this.minDate.toDate();

        $scope.$watch(() => this.internalJSDate, () => {
            if (this.internalJSDate < this.internalMinDate) {
                this.internalJSDate = this.internalMinDate;
            }
            this.updatePickedDate();
        });
        $scope.$watch(() => this.timeZone, () => this.updatePickedDate());
    }

    updatePickedDate() {
        const pickedMoment = moment(this.internalJSDate);
        const formattedMoment = pickedMoment.format('MMM DD HH:mm');
        this.pickedDate = moment.tz(formattedMoment, 'MMM DD HH:mm', this.timeZone);
    }

    toggle(event) {
        event.preventDefault();
        event.stopPropagation();
        this.opened = !this.opened;
    }
}
DateTimePickerCtrl.$inject = ['$scope'];

/**
 * @ngdoc directive
 * @name directive:dateTimePicker
 * @description
 *
 * A combined bootstrap time+date picker directive
 */
function dateTimePicker() {
    return {
        restrict: 'AE',
        scope: {
            minDate: '=?',
            pickedDate: '=',
            meridian: '=',
            timeZone: '=',
            minuteStep: '='
        },
        template,
        controller: DateTimePickerCtrl,
        controllerAs: 'picker',
        bindToController: true
    };
}
dateTimePicker.$inject = [];

export default dateTimePicker;
