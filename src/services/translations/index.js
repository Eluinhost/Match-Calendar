import en from './en';

import _ from 'lodash';
import moment from 'moment-timezone';

const STORAGE_KEY = 'chosenLanguage';
const TRANSLATIONS = { en };
const LANGUAGE_IDS = Object.keys(TRANSLATIONS);
const MAPPINGS = {
    'en_*': 'en'
};
const FRIENDLY = {
    en: 'English'
};

class TranslationsService {
    constructor($localForage, $rootScope, $translate, $log) {
        this.chosen = $translate.use();
        this.translations = TRANSLATIONS;
        this.keys = LANGUAGE_IDS;
        this.friendly = FRIENDLY;

        $localForage
            .getItem(STORAGE_KEY)
            .then(chosen => {
                if (!_.isNull(chosen)) {
                    this.chosen = chosen;
                }

                $rootScope.$watch(() => this.chosen, () => {
                    $localForage.setItem(STORAGE_KEY, this.chosen);
                    $log.info(`Language switching to ${this.chosen}`);
                    $translate.use(this.chosen);
                    moment.locale(this.chosen);
                    $rootScope.$broadcast('language');
                });
            });
    }
}
TranslationsService.$inject = ['$localForage', '$rootScope', '$translate', '$log'];

class TranslationsProvider {
    constructor($translateProvider) {
        this.translations = TRANSLATIONS;
        this.keys = LANGUAGE_IDS;

        _.forEach(TRANSLATIONS, (value, key) => $translateProvider.translations(key, value));

        $translateProvider
            .fallbackLanguage('en')
            .registerAvailableLanguageKeys(LANGUAGE_IDS, MAPPINGS)
            .determinePreferredLanguage();

        $translateProvider.useSanitizeValueStrategy('sanitize');

        this.$get = function (...deps) {
            return new TranslationsService(...deps);
        };
        this.$get.$inject = TranslationsService.$inject;
    }
}
TranslationsProvider.$inject = ['$translateProvider'];

export default TranslationsProvider;
