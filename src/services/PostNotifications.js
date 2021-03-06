import _ from 'lodash';

const TIMES_KEY = 'notificationTimes';
const NOTIFY_KEY = 'notifyFor';
const SOUNDS_KEY = 'playSound';

class PostNotifications {
    constructor(HtmlNotifications, Posts, DurationFormatter, DateTime, $rootScope, $localForage, $translate) {
        this.Posts = Posts;
        this.HtmlNotifications = HtmlNotifications;
        this.DurationFormatter = DurationFormatter;
        this.DateTime = DateTime;
        this.$translate = $translate;

        this.notifyFor = {};
        this.notificationTimes = [600];
        this.playSounds = true;

        this.initialised = $localForage
            .getItem([TIMES_KEY, NOTIFY_KEY, SOUNDS_KEY])
            .spread((times, notify, sounds) => {
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

                if (!_.isNull(sounds)) {
                    this.playSounds = sounds;
                }

                $rootScope.$watchCollection(
                    () => this.notificationTimes,
                    () => $localForage.setItem(TIMES_KEY, this.notificationTimes)
                );
                $rootScope.$watch(() => this.notifyFor, () => $localForage.setItem(NOTIFY_KEY, this.notifyFor), true);
                $rootScope.$watch(() => this.playSounds, () => $localForage.setItem(SOUNDS_KEY, this.playSounds));
            });

        $rootScope.$on('tick', () => this.recheckPosts());
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
        const post = _.find(this.Posts.posts, post => post.id === postid);

        // Post doesn't exist anymore
        if (_.isUndefined(post)) {
            delete this.notifyFor[postid];
            return;
        }

        const currentTimeUnix = this.DateTime.getTime().unix();

        this.notificationTimes.forEach(time => {
            const unix = post.opens.unix();
            const timeToNotify = unix - time;

            // If it's passed the notify time and we havn't already done a notification later than this
            if (currentTimeUnix >= timeToNotify && this.notifyFor[postid].value < timeToNotify) {
                const difference = unix - currentTimeUnix;

                this.$translate(
                    'notifications.notification',
                    {
                        time: this.DurationFormatter.format(Math.round(difference))
                    }
                ).then(message => {
                    this.HtmlNotifications.notify(message, post.title);

                    if (this.playSounds) {
                        new Audio(require('file!app/sounds/notification.m4a')).play();
                    }
                });

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
        this.notifyFor[postid] = { value: 0 };
    }

    removeNotification(postid) {
        delete this.notifyFor[postid];
    }

    isNotifyingFor(postid) {
        return !_.isUndefined(this.notifyFor[postid]);
    }
}
PostNotifications.$inject =
    ['HtmlNotifications', 'Posts', 'DurationFormatter', 'DateTime', '$rootScope', '$localForage', '$translate'];

export default PostNotifications;
