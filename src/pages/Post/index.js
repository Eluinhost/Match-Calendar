import _ from 'lodash';

class PostCtrl {
    constructor($stateParams, $state, Posts) {
        this.$state = $state;

        if (_.isEmpty($stateParams.id)) {
            this.goBackToList();
            return;
        }

        this.post = _.find(Posts.posts, p => p.id === $stateParams.id);

        if (_.isUndefined(this.post)) {
            this.goBackToList();
        }
    }

    goBackToList() {
        this.$state.go('app.list');
    }
}
PostCtrl.$inject = ['$stateParams', '$state', 'Posts'];

let controllerName = 'PostCtrl';

let state = {
    name: 'app.post',
    url: '/post/:id',
    template: require('./template.html'),
    controller: `${controllerName} as post`,
    resolve: {
        savedData: ['Posts', function(Posts) {
            // Only load once posts have loaded at least once
            return Posts.firstQuery;
        }]
    }
};

export { PostCtrl as controller, controllerName, state };

export default state;
