define(function(require) {
    var log = require("loglevel"),
        $ = require("jquery"),
        ui = require("ui"),
        ajax = require("ratelimitedajax");

    var urlPrefix = "https://jsonp.afeld.me/?url=http://fantasy.premierleague.com";

    /**
     * Load league data and display it in a table.
     * @param id
     * @param callback
     */
    function loadLeague(id, callback) {
        log.trace("loadLeague", arguments);

        if((typeof id !== "string" && typeof id !== "number") || typeof callback !== "function") {
            log.error("Invalid arguments provided to 'loadLeague' method");
            return;
        }

        var url = urlPrefix + "/my-leagues/" + id + "/standings/";
        log.debug("created league url: " + url);

        ui.loading(true);
        ajax({
            url: url,
            success: function(data) {
                var table = parseTable(data);
                updateLeague(table, callback);
            },
            error: function(jqXHR, errorType, errorMessage) {
                log.trace("loadLeague.ajax.error", arguments);
                log.error("error looking up league id: '"+id+"'. [type='"+errorType+"' message='"+errorMessage+"']");
                ui.displaySearchError("Error looking up league id. Please try again.");
            }
        });
    }

    /**
     * Parse the html returned from a league page into a table object
     * @param data
     * @returns {Array}
     * @private
     */
    function parseTable(data) {
        log.trace("parseTable", arguments);

        var $data = $(data),
            $rows = $data.find("#ism table tr:not(:eq(0))"),
            table = [];

        $rows.each(function(i, el) {
            var $cols = $(el).find("td");
            table[i] = {
                teamName: $cols.eq(2).text(),
                url: $cols.eq(2).find("a").attr("href"),
                manager: $cols.eq(3).text(),
                gwPoints: +$cols.eq(4).text().replace(/\D/g, ""),
                points: +$cols.eq(5).text().replace(/\D/g, "")
            };
        });

        log.debug("parsed table: ", table);
        return table;
    }

    /**
     * Run through the league table and update each team with data from their team page
     * @param table
     * @param callback
     * @private
     */
    function updateLeague(table, callback) {
        log.trace("updateLeague", arguments);

        var numRequests = table.length;
        var updatedTeam = function() {
            if(--numRequests <= 0) {
                log.debug("updated league table: ", table);
                ui.loading(false);
                callback(table);
            }
            ui.updateProgress(100 * (1 - numRequests / table.length));
        };

        for(var i = 0; i < table.length; i++) {
            updateTeam(table[i], updatedTeam);
        }
    }

    /**
     * Attempt to update a team with the latest data from its team page
     * @param team
     * @param callback
     * @private
     */
    function updateTeam(team, callback) {
        log.trace("updateTeam", arguments);

        var url = urlPrefix + team.url;
        log.debug("created team url: "+url);

        ajax({
            url: url,
            complete: function() {
                log.trace("updateTeam.ajax.complete", arguments);
                callback();
            },
            success: function(data) {
                log.trace("updateTeam.ajax.success", arguments);

                var pts = +$(data)
                    .find(".ism-scoreboard-panel__points")
                    .text().split("pts").join("");

                team.points += pts - team.gwPoints;
                team.gwPoints = pts;
                team.updated = (new Date()).getTime();
            },
            error: function(jqXHR, errorType, errorMessage) {
                log.trace("updateTeam.ajax.error", arguments);
                log.error("error updating team: '"+ team.teamName +"'. [type='"+errorType+"' message='"+errorMessage+"']");
            }
        });

    }

    return {
        loadLeague: loadLeague
    }
});
