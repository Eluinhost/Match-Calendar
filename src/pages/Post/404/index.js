class Post404Ctrl {
    constructor($stateParams, $state, $interval, $scope) {
        this.postId = $stateParams.id;
        this.$state = $state;

        this.recheckTime = 15;
        this.seconds = this.recheckTime;

        let x = $interval(() => {
            this.seconds--;

            if (this.seconds === 0) {
                this.tryAgain();
            }
        }, 1000);

        $scope.$on('$destroy', () => {
            $interval.cancel(x);
        });
    }

    tryAgain() {
        this.seconds = this.recheckTime;
        this.$state.go('app.post', {id: this.postId});
    }
}
Post404Ctrl.$inject = ['$stateParams', '$state', '$interval', '$scope'];

let controllerName = 'Post404Ctrl';

let state = {
    name: 'app.post404',
    url: '/post/:id/404',
    template: require('./template.html'),
    controller: `${controllerName} as post`
};

export { Post404Ctrl as controller, controllerName, state };

export default state;
