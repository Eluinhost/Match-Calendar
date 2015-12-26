import _ from 'lodash';

class Post404Ctrl {
    constructor($stateParams, $state, Posts, $interval) {
        this.postId = $stateParams.id;
        this.Posts = Posts;

        this.recheckTime = 15;
        this.seconds = this.recheckTime;

        $interval(() => {
            this.seconds--;

            if (this.seconds === 0) {
                this.seconds = this.recheckTime;

                if (this.postExists()) {
                    $state.go('app.post', {id: this.postId});
                }
            }
        }, 1000);
    }

    postExists() {
        return !_.isUndefined(_.find(this.Posts.posts, p => p.id === this.postId));
    }
}
Post404Ctrl.$inject = ['$stateParams', '$state', 'Posts', '$interval'];

let controllerName = 'Post404Ctrl';

let state = {
    name: 'app.post404',
    url: '/post/:id/404',
    template: require('./template.html'),
    controller: `${controllerName} as post`,
    resolve: {
        savedData: ['Posts', function(Posts) {
            // Only load once posts have loaded at least once
            return Posts.firstQuery;
        }]
    }
};

export { Post404Ctrl as controller, controllerName, state };

export default state;
