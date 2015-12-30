import en from './en';
import fr from './fr';
import _ from 'lodash';

const STORAGE_KEY = 'chosenLanguage';
const TRANSLATIONS = { en, fr };
const LANGUAGE_IDS = Object.keys(TRANSLATIONS);
const MAPPINGS = {
    'en_*': 'en',
    'fr_*': 'fr'
};
const FRIENDLY = {
    en: 'English',
    fr: 'Français'
};

class TranslationsService {
    constructor($localForage, $rootScope, $translate) {
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
                    $translate.use(this.chosen);
                });
            });
    }
}
TranslationsService.$inject = ['$localForage', '$rootScope', '$translate'];

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
