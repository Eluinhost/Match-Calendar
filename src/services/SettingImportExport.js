import _ from 'lodash';

class SettingImportExport {
    constructor($localForage) {
        this.$localForage = $localForage;
    }

    export() {
        const data = {};
        return this.$localForage
            .iterate((value, key) => {
                data[key] = value;
            })
            .then(() => data);
    }

    import(data) {
        return this.$localForage
            .clear()
            .then(() => Promise.all(_.map(data, (value, key) => this.$localForage.setItem(key, value))));
    }
}
SettingImportExport.$inject = ['$localForage'];

export default SettingImportExport;
