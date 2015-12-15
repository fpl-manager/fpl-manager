define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery");

    var rateLimit = function(func, rate) {
        var queue = [];
        var currentlyEmptyingQueue = false;

        var emptyQueue = function() {
            if (queue.length) {
                currentlyEmptyingQueue = true;
                _.delay(function() {
                    queue.shift().call();
                    emptyQueue();
                }, rate);
            } else {
                currentlyEmptyingQueue = false;
            }
        };

        return function() {
            var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
            queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
            if (!currentlyEmptyingQueue) { emptyQueue(); }
        };
    };

    return rateLimit($.ajax, 300);
});