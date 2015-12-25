import _ from 'lodash';

let decorators = {
    uibTimepickerDirective: require('./bsTimepickerTemplate.html'),
    uibDaypickerDirective: require('./bsDaypickerTemplate.html'),
    uibMonthpickerDirective: require('./bsMonthpickerTemplate.html'),
    uibYearpickerDirective: require('./bsYearpickerTemplate.html')
};

export default _.mapValues(decorators, function(template) {
    let decorator = function($delegate) {
        let directive = $delegate[0];

        directive.templateUrl = undefined;
        directive.template = template;

        return $delegate;
    };
    decorator.$inject = ['$delegate'];
    return decorator;
});
