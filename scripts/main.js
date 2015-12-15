/**
 * fpl-manager
 */
define(function(require) {
    var log = require("loglevel"),
        ui = require("ui"),
        leagues = require("leagues");
    log.setLevel("info");

    log.trace("Starting app");

    // Load league from request parameter
    var query;
    if(query=(new RegExp('[?&]id=([^&]*)')).exec(location.search)) {
        log.debug("id from request parameter: ", query[1]);
        ui.setSearch(query[1]);
        leagues.loadLeague(query[1], ui.displayTable);
    }

    // Load league from search
    ui.onSearch(function(query) {
        location.href = "./?id=" + query;
    });
});