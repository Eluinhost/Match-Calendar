import {parseGameType} from 'app/services/GameTypes';
import moment from 'moment-timezone';
import he from 'he';
import _ from 'lodash';

const IP_REGEX = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?/g;
const DOMAIN_REGEX = /(IP|Address).*?([a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)+(:\d{1,5})?)/gi; // jscs:ignore maximumLineLength
const SIZE_REGEX = /To([\dX]+)/i;
const EXTRAS_REGEX = /(\[.*?])/g;

class MatchPostParser {
    constructor(DateTime, $location, $log) {
        this.DateTime = DateTime;
        this.$location = $location;
        this.$log = $log;
    }

    _parseTitle(title) {
        let details = {
            title,
            extras: []
        };

        let pipeIndex = title.indexOf('|');
        details.isStartTime = pipeIndex !== -1;

        // Replace the | with a -
        if (details.isStartTime) {
            title = title.substr(0, pipeIndex) + '-' + title.substr(pipeIndex + 1);
        }

        let sections = title
            .split('-')
            .map(part => part.trim());

        // Post isnt formatted correctly, don't display it at all
        if (sections.length < 3) {
            throw new Error('Not enough parts in post title');
        }

        let [dateRegionSection, titleSection, teamStyleSection, scenariosSection] = sections;

        // Grab the opening time and region from the first section
        _.merge(details, this._parseDateAndRegion(dateRegionSection));

        // Copy the title across without the other sections
        details.title = titleSection;

        // Assume vanilla if no gamemodes section
        if (_.isUndefined(scenariosSection)) {
            details.gamemodes = ['Vanilla'];

            // Cut out the extras from team types
            let extrasInfo = this._parseExtras(teamStyleSection);
            details.extras = extrasInfo.extras;
            teamStyleSection = extrasInfo.section;
        } else {
            // Add gamemodes
            details.gamemodes = this._parseScenarios(scenariosSection);

            // Cut out the extras from the final scenario

            if (details.gamemodes.length > 0) {
                let finalIndex = details.gamemodes.length - 1;

                let extrasInfo = this._parseExtras(details.gamemodes[finalIndex]);
                details.extras = extrasInfo.extras;
                details.gamemodes[finalIndex] = extrasInfo.section;
            }
        }

        let teamInfo = this._parseTeamStyle(teamStyleSection);
        details.teams = teamInfo.type;
        details.teamSize = teamInfo.size;

        return details;
    }

    _parseTeamStyle(section) {
        section = section.trim();

        SIZE_REGEX.exec('');
        let sizeCheck = SIZE_REGEX.exec(section);

        let size = 0;
        let style = section;

        // Check for a teamsize if we can
        if (!_.isNull(sizeCheck)) {
            size = sizeCheck[1];
            style = section.replace(SIZE_REGEX, '').trim();
        }

        // Attempt to get the game type
        let type = parseGameType(style);

        return {
            type: _.isUndefined(type) ? section : type.name,
            size: size
        };
    }

    _parseExtras(section) {
        let extras = [];
        section = section
            .replace(EXTRAS_REGEX, part => {
                extras.push(part);
                return '';
            })
            .trim();

        return { section, extras };
    }

    _parseDateAndRegion(section) {
        // Definitely not formatted correctly
        if (section.length < 3) {
            throw new Error('Incorrect formatting in date and region section');
        }

        // Parse the region as the last 2 characters
        let region = section.slice(-2).toUpperCase();

        // Attempt to parse the date from the remains
        let opens = moment.utc(section.slice(0, -2), 'MMM DD HH:mm', 'en');

        return { region, opens };
    }

    _parseScenarios(section) {
        return section.split(',').map(mode => mode.trim());
    }

    _getAddress(content) {
        // Reset regex in case of exact copy of previous post
        IP_REGEX.exec('');
        let ipcheck = IP_REGEX.exec(content);

        // Check IP before falling back to domain
        if (!_.isNull(ipcheck)) {
            let address = ipcheck[1];

            // Only show port if it's not the default port
            if (!_.isEmpty(ipcheck[2]) && ipcheck[2] !== ':25565') {
                address += ipcheck[2];
            }

            return address;
        }

        DOMAIN_REGEX.exec('');
        let domainCheck = DOMAIN_REGEX.exec(content);

        if (!_.isNull(domainCheck)) {
            return domainCheck[2];
        }
    }

    /**
     * @param element the raw post element from the JSON api
     */
    parse(element) {
        // Add basic stuff from the post itself
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        let post = {
            id: element.id,
            title: element.title,
            selftext: element.selftext,
            author: element.author,
            permalink: `https://reddit.com${element.permalink}`,
            posted: moment(element.created_utc, 'X'),
            anchorlink: `#${this.$location.path()}?post=${element.id}`,
            isCommunityGame: element.link_flair_text && element.link_flair_text === 'Community Game',
            subreddit: element.subreddit,
            valid: false
        };
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        // Grab all of the information from the title
        try {
            let parsed = this._parseTitle(element.title);

            // Fix html encoded entities breaking in post titles
            parsed.title = he.decode(parsed.title, {
                isAttributeValue: true
            });

            // Append the extras to the title
            if (parsed.extras.length > 0) {
                parsed.title = parsed.title + ' ' + parsed.extras.join(' ');
            }

            delete parsed.extras;
            _.merge(post, parsed);
        } catch (err) {
            this.$log.warn('Unable to parse post', element.title, post.permalink, err);
            return post;
        }

        post.address = this._getAddress(element.selftext);

        if (_.isNull(post.opens) || !post.opens.isValid()) {
            return post;
        }

        let current = this.DateTime.getTime();
        let monthsAgo = post.opens.diff(current, 'months');

        // If it's more than 6 months old, assume it's in the next year
        if (monthsAgo < -6) {
            post.opens.add(1, 'years');
        }
        // If it's more than 6 months in the future assume it's in the last year
        else if (monthsAgo > 6) {
            post.opens.subtract(1, 'years');
        }

        post.valid = true;
        return post;
    }
}
MatchPostParser.$inject = ['DateTime', '$location', '$log'];

export default MatchPostParser;
