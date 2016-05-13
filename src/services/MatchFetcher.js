import { isString, map, remove, flatten } from 'lodash';
import moment from 'moment-timezone';
import MatchPostParser from 'app/../shared/MatchPostParser';

const postEndpoint = sub => `/api/v2/r/${sub}`;
const singleItem = id => `https://www.reddit.com/by_id/t3_${id}.json`;

const parser = new MatchPostParser();

export default class MatchFetcher {
    constructor($http, $q, DateTime, $log, $window) {
        this.$http = $http;
        this.$q = $q;
        this.DateTime = DateTime;
        this.$log = $log;

        this._init = ($window.APP_INITIAL_DATA || { subreddits: [] }).subreddits;
    }

    fetchById(id) {
        return this.$http
            .get(singleItem(id))
            .then(raw => {
                const data = raw.data.data.children[0].data;

                if (!data) {
                    return this.$q.reject('Failed to get post information from API');
                }

                const post = parser.parse(data);

                if (!post) {
                    return this.$q.reject('Failed to parse post from returned API data');
                }

                return this._processPost(post);
            });
    }

    fetch(subreddits) {
        // When all are completed
        return this.$q.all(map(subreddits, it => this.fetchSingle(it))).then(data => {
            const errors = remove(data, isString);

            const parsed = flatten(data); // flatten subs into single array
            const unparsed = remove(parsed, it => !it.valid);

            return {
                parsed,
                unparsed,
                errors
            };
        });
    }

    fetchSingle(subreddit) {
        return this._fetchRaw(subreddit)
            .then(data => map(data, it => this._processPost(it)))
            .catch(error => {
                this.$log.error('Failed to fetch data for:', subreddit, error);
                return subreddit;
            });
    }

    _fetchRaw(subreddit) {
        if (this._init[subreddit]) {
            const promise = this.$q.resolve(this._init[subreddit]);
            this._init[subreddit] = undefined;
            this.$log.debug('Got data from init data:', subreddit);
            return promise;
        }

        return this.$http
            .get(postEndpoint(subreddit))
            .then(raw => {
                if (raw.status >= 400) {
                    throw new Error('Server returned invalid response');
                }

                return raw.data;
            });
    }

    _processPost(post) {
        post.postedUnix = post.posted;
        post.posted = moment.utc(post.posted, 'X'); // Parse the posted times as unix timestamp

        if (post.valid) {
            post.opensUnix = post.opens;
            post.opens = moment.utc(post.opens, 'X'); // Convert opening times to date
        }

        return post;
    }
}
MatchFetcher.$inject = ['$http', '$q', 'DateTime', '$log', '$window'];
