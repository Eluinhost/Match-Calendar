import Promise from 'bluebird';

class SettingImportCtrl {
    constructor(SettingImportExport, $window, $uibModal) {
        this.SettingImportExport = SettingImportExport;
        this.$window = $window;
        this.$uibModal = $uibModal;
    }

    import() {
        return Promise.try(() => JSON.parse(this.toImport))
            .then(data => this.SettingImportExport.import(data))
            .then(() => this.$window.location.reload())
            .catch(() => this.$uibModal.open({
                template: 'Failed to import settings. Please double check the input is correct' }
            ));
    }

    export() {
        return this.SettingImportExport.export()
            .then(data => {
                const file = `text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, '\t'))}`;

                const link = document.createElement('a');
                link.href = `data:${file}`;
                link.download = 'data.json';
                link.click();
            })
            .then(() => this.$window.location.reload())
            .catch(() => this.$uibModal.open({
                template: 'Failed to export settings.' }
            ));
    }
}
SettingImportCtrl.$inject = ['SettingImportExport', '$window', '$uibModal'];

const controllerName = 'SettingImportCtrl';

const state = {
    name: 'app.settingimport',
    url: '/import',
    template: require('./template.html'),
    controller: `${controllerName} as settingimport`,
    resolve: {
        savedData: ['$q', 'Subreddits', 'PostNotifications', 'Hosts', 'Templates', 'HtmlNotifications',
            function ($q, ...others) {
                return $q.all(others.map(o => o.initialised));
            }
        ]
    }
};

export { SettingImportCtrl as controller, controllerName, state };

export default state;
