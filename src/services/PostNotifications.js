import _ from 'lodash';

const TIMES_KEY = 'notificationTimes';
const NOTIFY_KEY = 'notifyFor';

class PostNotifications {
    constructor(HtmlNotifications, Posts, DurationFormatter, DateTime, $rootScope, $localForage) {
        this.Posts = Posts;
        this.HtmlNotifications = HtmlNotifications;
        this.DurationFormatter = DurationFormatter;
        this.DateTime = DateTime;

        this.notifyFor = {};
        this.notificationTimes = [600];

        this.initialised = $localForage
            .getItem([TIMES_KEY, NOTIFY_KEY])
            .spread((times, notify) => {
                if (!_.isNull(times)) {
                    // Check for old { value: <int> } style and convert
                    if (_.isObject(times[0])) {
                        times = times.map(time => time.value);
                    }

                    this.notificationTimes = times;
                }

                if (!_.isNull(notify)) {
                    this.notifyFor = notify;
                }

                $rootScope.$watchCollection(
                    () => this.notificationTimes,
                    () => $localForage.setItem(TIMES_KEY, this.notificationTimes)
                );
                $rootScope.$watch(() => this.notifyFor, () => $localForage.setItem(NOTIFY_KEY, this.notifyFor), true);
            });

        $rootScope.$on('clockTick', () => this.recheckPosts());
    }

    recheckPosts() {
        if (this.HtmlNotifications.permission() !== 'granted') {
            return;
        }

        // No posts, probably still syncing
        if (this.Posts.posts.length === 0) {
            return;
        }

        // Check each individual post
        _.keys(this.notifyFor).forEach(id => this.checkNotificationForPostId(id));
    }

    checkNotificationForPostId(postid) {
        let post = _.find(this.Posts.posts, post => post.id === postid);

        // Post doesn't exist anymore
        if (_.isUndefined(post)) {
            delete this.notifyFor[postid];
            return;
        }

        let currentTimeUnix = this.DateTime.getTime().unix();

        this.notificationTimes.forEach(time => {
            let unix = post.opens.unix();
            let timeToNotify = unix - time;

            // If it's passed the notify time and we havn't already done a notification later than this
            if (currentTimeUnix >= timeToNotify && this.notifyFor[postid].value < timeToNotify) {
                let difference = unix - currentTimeUnix;
                this.HtmlNotifications.notify(
                    `Game opens in ${this.DurationFormatter.format(Math.round(difference))}`,
                    post.title
                );
                this.notifyFor[postid].value = currentTimeUnix;
            }
        });
    }

    addNewNotificationTime(time = 600) {
        this.notificationTimes.push(time);
    }

    removeNotificationTime(index = this.notificationTimes.length - 1) {
        if (index < 0) {
            return;
        }

        this.notificationTimes.splice(index, 1);
    }

    toggleNotifications(postid) {
        if (this.hasNotification(postid)) {
            this.removeNotification(postid);
        } else {
            this.addNotification(postid);
        }
    }

    hasNotification(postid) {
        return !_.isUndefined(this.notifyFor[postid]);
    }

    addNotification(postid) {
        // Set the last notification time to 0 to say we havn't done any
        this.notifyFor[postid] = {value: 0};
    }

    removeNotification(postid) {
        delete this.notifyFor[postid];
    }

    isNotifyingFor(postid) {
        return !_.isUndefined(this.notifyFor[postid]);
    }
}
PostNotifications.$inject =
    ['HtmlNotifications', 'Posts', 'DurationFormatter', 'DateTime', '$rootScope', '$localForage'];

export default PostNotifications;
