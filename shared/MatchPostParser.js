const { parseFromString } = require('./GameTypes');
const moment = require('moment-timezone');
const he = require('he');
const _ = require('lodash');

const IP_REGEX = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?/g;
const DOMAIN_REGEX = /[^\w](IP|Address).*?([a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)+(:\d{1,5})?)/gi; // eslint-disable-line max-len
const SIZE_REGEX = /To([\dX]+)/i;
const TAGS_REGEX = /[\[\(](.*?)[\]\)]/g;

module.exports = class MatchPostParser {
    _parseTitle(title) {
        const details = {
            title,
            tags: []
        };

        const pipeIndex = title.indexOf('|');
        details.isStartTime = pipeIndex !== -1;

        // Replace the | with a -
        if (details.isStartTime) {
            title = `${title.substr(0, pipeIndex)}-${title.substr(pipeIndex + 1)}`;
        }

        const sections = title
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

            // Cut out the tags from team types
            const tagsInfo = this._parseTags(teamStyleSection);
            details.tags = tagsInfo.tags;
            teamStyleSection = tagsInfo.section;
        } else {
            // Add gamemodes
            details.gamemodes = this._parseScenarios(scenariosSection);

            // Cut out the tags from the final scenario

            if (details.gamemodes.length > 0) {
                const finalIndex = details.gamemodes.length - 1;

                const tagsInfo = this._parseTags(details.gamemodes[finalIndex]);
                details.tags = tagsInfo.tags;
                details.gamemodes[finalIndex] = tagsInfo.section;
            }
        }

        const teamInfo = this._parseTeamStyle(teamStyleSection);
        details.teams = teamInfo.type;
        details.teamSize = teamInfo.size;

        return details;
    }

    _parseTeamStyle(section) {
        section = section.trim();

        SIZE_REGEX.exec('');
        const sizeCheck = SIZE_REGEX.exec(section);

        let size = 0;
        let style = section;

        // Check for a teamsize if we can
        if (!_.isNull(sizeCheck)) {
            size = sizeCheck[1];
            style = section.replace(SIZE_REGEX, '').trim();
        }

        // Attempt to get the game type
        const type = parseFromString(style);

        return {
            type: _.isUndefined(type) ? style : type.name,
            size
        };
    }

    _parseTags(section) {
        const tags = [];
        section = section
            .replace(TAGS_REGEX, (part, g1) => {
                tags.push(g1);
                return '';
            })
            .trim();

        return { section, tags };
    }

    _parseDateAndRegion(section) {
        // Definitely not formatted correctly
        if (section.length < 3) {
            throw new Error('Incorrect formatting in date and region section');
        }

        // Parse the region as the last 2 characters
        const region = section.slice(-2).toUpperCase();

        // Attempt to parse the date from the remains
        const opens = moment.utc(section.slice(0, -2), 'MMM DD HH:mm', 'en');

        return { region, opens };
    }

    _parseScenarios(section) {
        return section.split(',').map(mode => mode.trim());
    }

    _getAddress(content) {
        // Reset regex in case of exact copy of previous post
        IP_REGEX.exec('');
        const ipcheck = IP_REGEX.exec(content);

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
        const domainCheck = DOMAIN_REGEX.exec(content);

        if (!_.isNull(domainCheck)) {
            return domainCheck[2];
        }
    }

    /**
     * @param element the raw post element from the JSON api
     */
    parse(element) {
        // Add basic stuff from the post itself
        const post = {
            id: element.id,
            title: he.decode(element.title),
            selftext: he.decode(element.selftext),
            author: element.author,
            permalink: `https://reddit.com${element.permalink}`,
            posted: element.created_utc,
            subreddit: element.subreddit,
            valid: false
        };

        // Grab all of the information from the title
        try {
            _.merge(post, this._parseTitle(post.title));
        } catch (err) {
            return post;
        }

        post.address = this._getAddress(element.selftext);

        if (!_.isNull(post.opens) && post.opens.isValid()) {
            // Modify it to the correct year
            const monthsAgo = post.opens.diff(moment(), 'months');

            // If it's more than 6 months old, assume it's in the next year
            if (monthsAgo < -6) {
                post.opens.add(1, 'years');
            } else if (monthsAgo > 6) {
                // If it's more than 6 months in the future assume it's in the last year
                post.opens.subtract(1, 'years');
            }

            post.opens = parseInt(post.opens.format('X'), 10);
            post.valid = true;
        } else {
            post.opens = null;
        }

        return post;
    }
};
