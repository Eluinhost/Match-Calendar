function nightmode(DateTime) {
    return {
        scope: {},
        restrict: 'A',
        link: (scope, element) => {
            scope.$watch(() => DateTime.nightmode, () => {
                if (DateTime.nightmode) {
                    element.addClass('nightmode');
                } else {
                    element.removeClass('nightmode');
                }
            });
        }
    };
}
nightmode.$inject = ['DateTime'];

export default nightmode;
