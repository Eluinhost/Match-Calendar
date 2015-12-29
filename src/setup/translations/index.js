import en from './en';

function translations($translateProvider) {
    $translateProvider
        .translations('en', en)
        .preferredLanguage('en');

    $translateProvider.useSanitizeValueStrategy('sanitize');
}
translations.$inject = ['$translateProvider'];

export default translations;
