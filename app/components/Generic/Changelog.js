'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Changelog
 * @description
 * # Changelog
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Changelog', ['$uibModal', function ($uibModal) {
        var showChangelog = function() {
            $uibModal.open({
                template: '<div class="modal-header"><h3 class="modal-title">Changelog</h3></div><div class="modal-body"><markdown class="md" content="markdown"></markdown></div>',
                controller: ['$scope', '$http', function($scope, $http) {
                    $scope.markdown = '';

                    $http.get('/changelog.md').success(function(data) {
                        $scope.markdown = data;
                    }).error(function() {
                        $scope.markdown = 'Error loading changelog data';
                    });
                }]
            });
        };

        return {
            showChangelog: showChangelog
        };
    }]);
