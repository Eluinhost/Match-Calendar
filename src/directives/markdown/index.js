import MarkdownParser from 'app/services/MarkdownParser';

/**
 * @ngdoc directive
 * @name directive:markdown
 */
function markdown($sanitize) {
    return {
        require: 'ngModel',
        scope: {},
        restrict: 'EA',
        link: function(scope, element, attributes, ngModelCtrl) {
            element.addClass('md');

            ngModelCtrl.$render = function() {
                // Render the markdown to the DOM
                element.html($sanitize(MarkdownParser.render(ngModelCtrl.$viewValue || '')));
                // Replace all links to open in a new tab
                element.find('a').attr('target', '_blank');
            };
        }
    };
}
markdown.$inject = ['$sanitize'];

export default markdown;
