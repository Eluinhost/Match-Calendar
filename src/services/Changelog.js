let modalController = function($scope, $http, Changelog) {
    $scope.markdown = '';

    $http.get(Changelog.changelogURL)
        .success(data => $scope.markdown = data)
        .catch(() => $scope.markdown = 'Error loading changelog data');
};
modalController.$inject = ['$scope', '$http', 'Changelog'];

/**
 * @ngdoc service
 * @name service:Changelog
 * @description
 *
 * Shows the changelog via modal
 */
class Changelog {
    constructor($uibModal) {
        this.$uibModal = $uibModal;
        this.template =
`<div class="modal-header">
    <h3 class="modal-title">Changelog</h3>
</div>
<div class="modal-body">
    <markdown class="md" content="markdown"></markdown>
</div>`;
        this.changelogURL = '/changelog.md';
    }

    showChangelog() {
        this.$uibModal.open({
            template: this.template,
            controller: modalController
        });
    }
}
Changelog.$inject = ['$uibModal'];

export default Changelog;
