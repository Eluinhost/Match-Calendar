function delegate($delegate) {
    const original = $delegate.defer;

    $delegate.defer = function () {
        const prototype = original().promise.constructor.prototype;

        Object.defineProperty(prototype, 'spread', {
            value: function (resolve, reject) { // eslint-disable-line babel/object-shorthand
                function spread(data) {
                    return resolve.apply(undefined, data);
                }

                return this.then(spread, reject);
            },
            writable: true,
            enumerable: false
        });

        return original();
    };

    return $delegate;
}
delegate.$inject = ['$delegate'];

function q($provide) {
    $provide.decorator('$q', delegate);
}
q.$inject = ['$provide'];

export default q;
