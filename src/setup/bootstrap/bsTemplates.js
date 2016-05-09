import _ from 'lodash';

let decorators = {
    uibTimepickerDirective: require('./bsTimepickerTemplate.html'),
    uibDaypickerDirective: require('./bsDaypickerTemplate.html'),
    uibMonthpickerDirective: require('./bsMonthpickerTemplate.html'),
    uibYearpickerDirective: require('./bsYearpickerTemplate.html')
};

// Map templates to replacement directives
decorators = _.mapValues(decorators, template => {
    const decorator = function ($delegate) {
        const directive = $delegate[0];

        directive.templateUrl = undefined;
        directive.template = template;

        return $delegate;
    };
    decorator.$inject = ['$delegate'];
    return decorator;
});

export default decorators;
