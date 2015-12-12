import MarkdownParser from 'app/services/MarkdownParser';

/**
 * @ngdoc directive
 * @name directive:markdown
 */
function markdown($sanitize) {
    return {
        scope: {
            content: '='
        },
        restrict: 'EA',
        link: function(scope, element) {
            scope.$watch('content', function() {
                element.html($sanitize(MarkdownParser.render(scope.content)));
                element.find('a').attr('target', '_blank');
            }, true);
        }
    };
}
markdown.$inject = ['$sanitize'];

export default markdown;
