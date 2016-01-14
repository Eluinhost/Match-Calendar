import en from './en';
import de from './de';
import es from './es';
import nl from './nl';
import fr from './fr';

import _ from 'lodash';
import moment from 'moment-timezone';

const STORAGE_KEY = 'chosenLanguage';
const TRANSLATIONS = { en, fr, es, de, nl };
const LANGUAGE_IDS = Object.keys(TRANSLATIONS);
const MAPPINGS = {
    'en_*': 'en',
    'de_*': 'de',
    'nl_*': 'nl',
    'es_*': 'es',
    'fr_*': 'fr'
};
const FRIENDLY = {
    en: 'English',
    de: 'Deutsch',
    nl: 'Nederlands',
    es: 'Español',
    fr: 'Français'
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

        this.$get = function(...deps) {
            return new TranslationsService(...deps);
        };
        this.$get.$inject = TranslationsService.$inject;
    }
}
TranslationsProvider.$inject = ['$translateProvider'];

export default TranslationsProvider;
