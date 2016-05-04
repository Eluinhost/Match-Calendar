import _ from 'lodash';

class SettingImportExport {
    constructor($localForage, $q) {
        this.$localForage = $localForage;
        this.$q = $q;
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
            .then(() => this.$q.all(_.map(data, (value, key) => this.$localForage.setItem(key, value))));
    }
}
SettingImportExport.$inject = ['$localForage', '$q'];

export default SettingImportExport;
