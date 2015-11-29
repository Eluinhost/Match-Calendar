'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:TemplateEditorCtrl
 * @description
 * # TemplateEditorCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('TemplateEditorCtrl', ['$scope', '$interpolate', 'Templates', function ($scope, $interpolate, Templates) {
        $scope.templates = Templates;

        $scope.loadNew = function(template) {
            if (template) {
                // editing existing
                $scope.tempCopy = angular.copy(template);
                $scope.selected = template;
            } else {
                // new template
                $scope.tempCopy = {
                    name: '',
                    template: ''
                };
                $scope.selected = null;
            }

            // force refresh
            $scope.updatePreview();
        };

        // updates the preview window on change of the template
        $scope.updatePreview = function() {
            if (!$scope.tempCopy) {
                $scope.generated = '';
                return;
            }

            $scope.generated = $interpolate($scope.tempCopy.template, false, null, false)({

            });
        };

        // TODO check name conflicts
        // saves the template to the templates service
        $scope.saveTemplate = function() {
            if ($scope.selected) {
                $scope.selected.name = $scope.tempCopy.name;
                $scope.selected.template = $scope.tempCopy.template;
            } else {
                Templates.customTemplates.push($scope.tempCopy);
            }

            // reset the view to avoid problems with sync
            $scope.reset();
        };

        $scope.isNameValid = function() {
            // if for some reason it doesnt exist
            if (!$scope.tempCopy) return false;

            // disallow empty/null names
            if (!$scope.tempCopy.name) return false;

            // if it's the same name as the currently selected one
            if ($scope.selected && ($scope.selected.name === $scope.tempCopy.name)) {
                return true;
            }

            return !Templates.customTemplateExists($scope.tempCopy.name);
        };

        // deletes a template without warning
        $scope.deleteTemplate = function() {
            var index = -1;
            for (var i = 0; i < Templates.customTemplates.length; i++) {
                if (Templates.customTemplates[i].name === $scope.selected.name) {
                    index = i;
                    break;
                }
            }

            if (index === -1) return;

            Templates.customTemplates.splice(index, 1);
            $scope.reset();
        };

        // reset the view to normal
        $scope.reset = function() {
            $scope.selected = null;
            $scope.tempCopy = null;
            $scope.preview = '';
        };

        // initialize
        $scope.reset();
    }]);
