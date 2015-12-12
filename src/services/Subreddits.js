import _ from 'lodash';

const KEY = 'subreddits';

class Subreddits {
    constructor($localForage, $rootScope) {
        this.subreddits = ['uhcmatches'];

        // Set a promise to resolve on in routes
        this.initialised = $localForage.getItem(KEY)
            .then(value => {
                if (!_.isNull(value)) {
                    this.subreddits = value;
                }

                $rootScope.$watchCollection(() => this.subreddits, () => $localForage.setItem(KEY, this.subreddits));
            });
    }

    addSubreddit(name = '') {
        if (this.hasSubreddit(name)) {
            return;
        }

        name = name.trim();

        if (_.isEmpty(name)) {
            return;
        }

        this.subreddits.push(name.toLowerCase());
    }

    hasSubreddit(name = '') {
        return _.contains(this.subreddits, name.trim().toLowerCase());
    }

    deleteSubreddit(name = '') {
        let lowered = name.toLowerCase().trim();

        _.remove(this.subreddits, sub => sub === lowered);
    }
}
Subreddits.$inject = ['$localForage', '$rootScope'];

export default Subreddits;
