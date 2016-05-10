import _ from 'lodash';

const BASE_URL = 'https://www.reddit.com/';
const API_BASE_URL = '/api/v1/r/';

class RedditPostsService {
    constructor($http, $q, $filter, MatchPostParser, DateTime) {
        this.$http = $http;
        this.$q = $q;
        this.$filter = $filter;
        this.MatchPostParser = MatchPostParser;
        this.DateTime = DateTime;

        this.initData = APP_INITIAL_DATA.subreddits;
    }

    _querySingle(subreddit) {
        let promise;
        if (this.initData[subreddit]) {
            promise = this.$q.resolve({ data: this.initData[subreddit] });
            this.initData[subreddit] = undefined;
        } else {
            promise = this.$http.get(API_BASE_URL + subreddit);
        }

        return promise
            // Parse each element and filter out null posts
            .then(data => data.data.data.children.map(element => this.MatchPostParser.parse(element.data)))
            .catch(() => subreddit);
    }

    getSinglePost(id) {
        return this.$http
            .get(`${BASE_URL}/by_id/t3_${id}.json`)
            .then(raw => {
                const data = raw.data.data.children[0].data;

                if (!data) {
                    return this.$q.reject('Failed to get post information from API');
                }

                const post = this.MatchPostParser.parse(data);

                if (!post) {
                    return this.$q.reject('Failed to parse post from returned API data');
                }

                return post;
            });
    }

    query(subreddits) {
        const subPromises = subreddits.map(sub => this._querySingle(sub));

        // When all are completed
        return this.$q.all(subPromises)
            .then(data => {
                // Split into separated arrays
                const errorSubs = _.filter(data, _.isString);

                const posts = _(data)
                    .filter(_.isArray)
                    .flatten();

                const halfHourAgo = this.DateTime.getTime().subtract(30, 'minutes');
                const parsed = posts
                    .filter(item => item.valid)
                    .filter(post => halfHourAgo.diff(post.opens) < 0)
                    .sortBy(item => item.opens.format('X'))
                    .value();

                const unparsed = posts
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
