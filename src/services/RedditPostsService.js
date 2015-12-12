import _ from 'lodash';

const BASE_URL = 'https://www.reddit.com/r/';
const FLAIRS = 'q=flair:\'Upcoming Match\' OR flair:\'Community Game\'';

class RedditPostsService {
    constructor($http, $q, $filter, MatchPostParser, DateTime) {
        this.$http = $http;
        this.$q = $q;
        this.$filter = $filter;
        this.MatchPostParser = MatchPostParser;
        this.DateTime = DateTime;
    }

    _createURL(sub, limit, sort) {
        return `${BASE_URL}${sub}/search.json?${FLAIRS}&restrict_sr=on&limit=${limit}&sort=${sort}`;
    }

    _querySingle(subreddit, limit = 100, sort = 'new') {
        return this.$http
            .get(this._createURL(subreddit, limit, sort))
            .then(data => {
                // Parse each element and filter out null posts
                return _(data.data.data.children)
                    .map(element => this.MatchPostParser.parse(element.data))
                    .filter(element => element !== null)
                    .value();
            })
            .catch(() => subreddit);
    }

    query(subreddits, limit = 100, sort = 'new') {
        // Reddit max is 100 per query anyway
        if (limit > 100) {
            limit = 100;
        }

        let subPromises = subreddits.map(sub => this._querySingle(sub, limit, sort));

        // When all are completed
        return this.$q.all(subPromises)
            .then(data => {
                // Split into separated arrays
                let errorSubs = _.filter(data, _.isString);

                let posts = _(data)
                    .filter(_.isArray)
                    .flatten()
                    .reduce(
                        function(acc, element) {
                            (element.opens ? acc.parsed : acc.unparsed).push(element);
                            return acc;
                        },
                        {
                            parsed: [],
                            unparsed: []
                        }
                    );

                let halfHourAgo = this.DateTime.getTime().subtract(30, 'minutes');

                // Sort the parsed ones in time order and filter out any older than 30 mins
                let filtered = _.sortBy(posts.parsed, post => post.opens.format('X'))
                                .filter(post => halfHourAgo.diff(post.opens) < 0);

                // Add the unparsed matches to the end of the results
                filtered.push.apply(filtered, posts.unparsed);

                return {
                    posts: filtered,
                    errors: errorSubs
                };
            });
    }
}
RedditPostsService.$inject = ['$http', '$q', '$filter', 'MatchPostParser', 'DateTime'];

export default RedditPostsService;
