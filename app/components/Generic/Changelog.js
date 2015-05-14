'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Changelog
 * @description
 * # Changelog
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Changelog', ['$modal', function ($modal) {
        var showChangelog = function() {
            $modal.open({
                template: '<div class="modal-header"><h3 class="modal-title">Changelog</h3></div><div class="modal-body"><markdown class="md" content="markdown"></markdown></div>',
                controller: function($scope, $http) {
                    $scope.markdown = '';

                    $http.get('/changelog.md').success(function(data) {
                        $scope.markdown = data;
                    }).error(function() {
                        $scope.markdown = 'Error loading changelog data';
                    });
                }
            });
        };

        return {
            showChangelog: showChangelog
        };
    }]);
