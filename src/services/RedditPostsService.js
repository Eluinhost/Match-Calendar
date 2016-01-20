import _ from 'lodash';

const BASE_URL = 'https://www.reddit.com/';
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
        return `${BASE_URL}r/${sub}/search.json?${FLAIRS}&restrict_sr=on&limit=${limit}&sort=${sort}`;
    }

    _querySingle(subreddit, limit = 100, sort = 'new') {
        return this.$http
            .get(this._createURL(subreddit, limit, sort))
            // Parse each element and filter out null posts
            .then(data => data.data.data.children.map(element => this.MatchPostParser.parse(element.data)))
            .catch(() => subreddit);
    }

    getSinglePost(id) {
        return this.$http
            .get(`${BASE_URL}/by_id/t3_${id}.json`)
            .then(raw => {
                let data = raw.data.data.children[0].data;

                if (!data) {
                    return this.$q.reject('Failed to get post information from API');
                }

                let post = this.MatchPostParser.parse(data);

                if (!post) {
                    return this.$q.reject('Failed to parse post from returned API data');
                }

                return post;
            });
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
                    .flatten();

                let halfHourAgo = this.DateTime.getTime().subtract(30, 'minutes');
                let parsed = posts
                    .filter(item => item.valid)
                    .filter(post => halfHourAgo.diff(post.opens) < 0)
                    .sortBy(item => item.opens.format('X'))
                    .value();

                let unparsed = posts
                    .filter(item => !item.valid)
                    .value();

                return {
                    posts: parsed,
                    unparsed,
                    errors: errorSubs
                };
            });
    }
}
RedditPostsService.$inject = ['$http', '$q', '$filter', 'MatchPostParser', 'DateTime'];

export default RedditPostsService;
