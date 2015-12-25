// Use non-default storage name
function localForage($localForageProvider) {
    $localForageProvider.config({
        name: 'MatchCalendar'
    });
}

localForage.$inject = ['$localForageProvider'];

export default localForage;
