import _ from 'lodash';
import template from './defaultTemplate.md';

const KEY = 'customTemplates';
const DEFAULT_TEMPLATE = {
    name: 'default',
    template: template
};

class Templates {
    constructor($interpolate, $localForage, $rootScope) {
        this.$interpolate = $interpolate;

        this.templates = [DEFAULT_TEMPLATE];

        // Set a promise to resolve on in route
        this.initialised = $localForage.getItem(KEY)
            .then(value => {
                if (!_.isNull(value)) {
                    this.templates = value;
                }

                let def = _.find(this.templates, t => t.name === 'default');

                if (_.isUndefined(def)) {
                    // Add the default to the array if it isnt there
                    this.templates.push(DEFAULT_TEMPLATE);
                } else {
                    // Update the existing default template
                    def.template = template;
                }

                $rootScope.$watch(() => this.templates, () => $localForage.setItem(KEY, this.templates), true);
            });
    }

    getDefault() {
        return _.find(this.templates, t => t.name === 'default');
    }

    hasTemplate(name) {
        return !!this.getTemplate(name);
    }

    getTemplate(name) {
        return _.find(this.templates, template => template.name === name);
    }

    compileTemplate(name, context) {
        let template = this.getTemplate(name);

        if (!template) {
            return '';
        }

        return this.$interpolate(template.template)(context);
    }
}
Templates.$inject = ['$interpolate', '$localForage', '$rootScope'];

export default Templates;
