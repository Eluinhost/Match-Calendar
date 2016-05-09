import angular from 'angular';
import moment from 'moment-timezone';
import _ from 'lodash';

class TemplateEditorCtrl {
    constructor($interpolate, Templates, DateTime) {
        this.Templates = Templates;
        this.$interpolate = $interpolate;
        this.DateTime = DateTime;

        this.reset();
    }

    loadNew(template) {
        if (template) {
            // Copy across the existing template for editing
            this.tempCopy = angular.copy(template);
            this.selected = template;
        } else {
            // Create a new template, set selected to null to signify that it's new
            this.tempCopy = {
                name: '',
                template: '## Edit this with markdown'
            };
            this.selected = null;
        }

        this.updatePreview();
    }

    updatePreview() {
        if (!this.tempCopy) {
            this.generated = '';
            return;
        }

        this.generated = this.$interpolate(this.tempCopy.template)({
            opensUTC: this.DateTime.format('REDDIT_POST', moment(), true),
            title: 'Example Title #20',
            region: 'AN',
            teams: 'rTo10',
            scenarios: 'Vanilla+, Longshots'
        });
    }

    // Saves the template to the templates service
    // TODO move to templates service
    saveTemplate() {
        if (this.selected) {
            this.selected.name = this.tempCopy.name;
            this.selected.template = this.tempCopy.template;
        } else {
            this.Templates.templates.push(this.tempCopy);
        }

        // Reset the view to avoid problems with sync
        // TODO verify if still an issue
        this.reset();
    }

    canDelete() {
        return this.selected && this.selected.name !== 'default';
    }

    cloneDefault() {
        this.tempCopy = {
            name: 'Copy of default',
            template: this.Templates.getDefault().template
        };
        this.selected = null;
        this.updatePreview();
    }

    isNameValid() {
        // If we are not editing something for some reason
        if (!this.tempCopy) {
            return false;
        }

        // Disallow empty/null names to be used
        if (_.isEmpty(this.tempCopy.name)) {
            return false;
        }

        // Don't allow the use of default
        if (this.tempCopy.name === 'default') {
            return false;
        }

        // If it's the same name as the currently selected one it's safe to save it
        if (this.selected && this.selected.name === this.tempCopy.name) {
            return true;
        }

        // Return if the template name is not already taken
        return !this.Templates.hasTemplate(this.tempCopy.name);
    }

    // Deletes a template, NOTE: no warning
    // TODO move into service
    deleteTemplate() {
        this.Templates.templates = _.reject(this.Templates.templates, template => template.name === this.selected.name);
        this.reset();
    }

    // Reset the view to back to the selection
    reset() {
        this.selected = null;
        this.tempCopy = null;
        this.preview = '';
    }
}
TemplateEditorCtrl.$inject = ['$interpolate', 'Templates', 'DateTime'];

const controllerName = 'TemplateEditorCtrl';

const state = {
    name: 'app.editor',
    url: '/editor',
    template: require('./template.html'),
    controller: `${controllerName} as editor`,
    resolve: {
        savedData: ['Templates', function (Templates) {
            return Templates.initialised;
        }]
    }
};

export { TemplateEditorCtrl as controller, controllerName, state };

export default state;
