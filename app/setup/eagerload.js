'use strict';

// eager load some services
// TODO fix up with ui-router resolve option with promises so this isnt needed
angular.module('MatchCalendarApp').run(['Posts', 'PostNotifications', 'DateTimeService', 'Templates', 'Subreddits', _.noop]);
