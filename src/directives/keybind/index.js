/**
 * @ngdoc directive
 * @name directive:keybind
 * @description
 *
 * Allows binding key codes to functions `keybind="expression()" key=13`
 */
function keybind() {
    return function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
            if (event.which === Number(attrs.key)) {
                scope.$apply(() => scope.$eval(attrs.keybind));
                event.preventDefault();
            }
        });
    };
}
keybind.$inject = [];

export default keybind;
