import _ from 'lodash';

let decorators = {
    uibTimepickerDirective: require('./bsTimepickerTemplate.html'),
    uibDaypickerDirective: require('./bsDaypickerTemplate.html'),
    uibMonthpickerDirective: require('./bsMonthpickerTemplate.html'),
    uibYearpickerDirective: require('./bsYearpickerTemplate.html'),
};

// Map templates to replacement directives
decorators = _.mapValues(decorators, function(template) {
    let decorator = function($delegate) {
        let directive = $delegate[0];

        directive.templateUrl = undefined;
        directive.template = template;

        return $delegate;
    };
    decorator.$inject = ['$delegate'];
    return decorator;
});

// Special decorator for removing the progress directive from bootstrap as it conflicts
decorators.progressDirective = function($delegate) {
    let dir = $delegate[0];
    dir.restrict = '';
    return $delegate;
};
decorators.progressDirective.$inject = ['$delegate'];

export default decorators;
