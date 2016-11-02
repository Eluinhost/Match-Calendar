import _ from 'lodash';
import { types as GameTypes } from 'app/../shared/GameTypes';

const OLD_KEY = 'generator';
const PREFIX = 'generator-';

const TITLE_KEY = `${PREFIX}postTitle`;
const REGION_KEY = `${PREFIX}region`;
const TYPE_KEY = `${PREFIX}gameType`;
const SIZE_KEY = `${PREFIX}teamSize`;
const SCENARIOS_KEY = `${PREFIX}scenarios`;
const SUBREDDIT_KEY = `${PREFIX}subreddit`;
const EXTRAS_KEY = `${PREFIX}extras`;
const TEMPLATE_KEY = `${PREFIX}template`;

class GeneratorCtrl {
    constructor($window, DateTime, Templates, Subreddits, Posts, $localForage, $rootScope) {
        this.$window = $window;
        this.DateTime = DateTime;
        this.Templates = Templates;
        this.Subreddits = Subreddits;
        this.GameTypes = GameTypes;

        this.regions = {
            AF: 'Africa',
            AN: 'Antartica',
            AS: 'Asia',
            EU: 'Europe',
            NA: 'North America',
            AU: 'Oceania',
            SA: 'South America'
        };

        this.postTitle = 'Your name\'s #1';
        this.region = 'NA';
        this.gameType = GameTypes.FFA.name;
        this.teamSize = 4;
        this.scenarios = ['Vanilla'];
        this.subreddit = Subreddits.subreddits[0];
        this.extras = [];
        this.template = Templates.getDefault().name;

        this.initialised = $localForage
            .getItem([
                OLD_KEY, TITLE_KEY, REGION_KEY, TYPE_KEY, SIZE_KEY,
                SCENARIOS_KEY, SUBREDDIT_KEY, EXTRAS_KEY, TEMPLATE_KEY
            ])
            .spread((old, postTitle, region, gameType, teamSize, scenarios, subreddit, extras, template) => {
                let toMerge = { postTitle, region, gameType, teamSize, scenarios, subreddit, extras, template };

                if (!_.isUndefined(old)) {
                    // Copy over the old details and remove everything at the old key
                    toMerge = old;
                    $localForage.removeItem(OLD_KEY);
                }

                // Merge in and overwrite defaults where needed
                _.mergeNotNull(this, toMerge);

                // Setup watchers to save back
                $rootScope.$watch(() => this.postTitle, () => $localForage.setItem(TITLE_KEY, this.postTitle));
                $rootScope.$watch(() => this.region, () => $localForage.setItem(REGION_KEY, this.region));
                $rootScope.$watch(() => this.gameType, () => $localForage.setItem(TYPE_KEY, this.gameType));
                $rootScope.$watch(() => this.teamSize, () => $localForage.setItem(SIZE_KEY, this.teamSize));
                $rootScope.$watch(() => this.subreddit, () => $localForage.setItem(SUBREDDIT_KEY, this.subreddit));
                $rootScope.$watch(() => this.template, () => $localForage.setItem(TEMPLATE_KEY, this.template));

                $rootScope.$watchCollection(
                    () => this.scenarios,
                    () => {
                        if (this.scenarios.length === 0) {
                            this.scenarios = ['Vanilla'];
                        }

                        // Replace any 'vanilla' entries with vanilla+ when adding a new scenario
                        if (this.scenarios.length > 1) {
                            this.scenarios = this.scenarios.map(scenario => {
                                return scenario.toLowerCase() === 'vanilla' ? 'Vanilla+' : scenario;
                            });
                        }
                        $localForage.setItem(SCENARIOS_KEY, this.scenarios);
                    }
                );
                $rootScope.$watchCollection(() => this.extras, () => $localForage.setItem(EXTRAS_KEY, this.extras));
            });

        const initial = DateTime.getTime().add(30, 'minutes');

        initial.milliseconds(Math.ceil(initial.milliseconds() / 1000) * 1000);
        initial.seconds(Math.ceil(initial.seconds() / 60) * 60);
        initial.minutes(Math.ceil(initial.minutes() / 15) * 15); // Round to nearest 15 mins

        this.opens = initial;
        this.minTime = this.opens;

        const checkOverhost = _.debounce(() => {
            this.overhost = _.find(Posts.posts, p => p.region === this.region && p.opens.isSame(this.opens, 'minutes'));
        }, 150);

        $rootScope.$watch(() => this.opens, checkOverhost);
        $rootScope.$watch(() => this.region, checkOverhost);

        // Temp variables to be used in adding new items to the arrays
        this.tempSubreddit = '';
        this.tempExtra = '';
    }

    requiresTeamSizes() {
        return GameTypes[this.gameType].requiresTeamSizes;
    }

    hasValidTemplate() {
        return this.template && this.template !== 'default' && this.Templates.hasTemplate(this.template);
    }

    hasValidSubreddit() {
        return _.includes(this.Subreddits.subreddits, this.subreddit);
    }

    generateTitle() {
        const time = this.DateTime.format('REDDIT_POST', this.opens.utc(), true);
        const teams = GameTypes[this.gameType].format(this.teamSize);
        const extras = this.extras.map(extra => `[${extra}]`).join(' ').trim();

        return `${time} ${this.region} - ${this.postTitle} - ${teams} - ${this.scenarios.join(', ')} ${extras}`;
    }

    // Opens a new window to create a reddit post with the compiled template and info included
    sendToReddit() {
        const context = {
            opensUTC: this.DateTime.format('REDDIT_POST', this.opens, true),
            title: this.postTitle,
            region: this.region,
            teams: GameTypes[this.gameType].format(this.teamSize),
            scenarios: this.scenarios.join(', '),
            DateTime: this.DateTime
        };
        const generated = this.Templates.compileTemplate(this.template, context);

        const title = encodeURIComponent(this.generateTitle());
        const contents = encodeURIComponent(
`${generated}

*^created ^using ^the [^Match ^Calendar](${this.$window.location.protocol}//${this.$window.location.host})*`
        );

        this.$window.open(`https://reddit.com/r/${this.subreddit}/submit?title=${title}&text=${contents}`, '_blank');
    }
}
GeneratorCtrl.$inject = ['$window', 'DateTime', 'Templates', 'Subreddits', 'Posts', '$localForage', '$rootScope'];

const controllerName = 'GeneratorCtrl';

const state = {
    name: 'app.generate',
    url: '/generate',
    template: require('./template.html'),
    controller: `${controllerName} as generator`,
    resolve: {
        savedData: ['$q', 'Templates', 'Subreddits', 'Posts', function ($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { GeneratorCtrl as controller, controllerName, state };

export default state;
