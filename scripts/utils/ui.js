define(function(require) {
    var log = require("loglevel"),
        $ = require("jquery");

    var selector = {
        searchForm: "#league-id-form",
        searchInput: "#league-id-input",
        searchLabel: "#league-id-label",
        progressBar: "#progress #bar",
        loadingIndicator: "#loading-indicator",
        table: "#league"
    };

    /**
     * Add a handler to the form submit
     * @param fn
     */
    function onSearch(fn) {
        $(selector.searchForm).on("submit", function(e) {
            var val = $(selector.searchInput).val();
            fn(val, e);
            return false;
        })
    }

    /**
     * Set value in search field
     * @param val
     */
    function setSearch(val) {
        $(selector.searchInput).val(val);
    }

    /**
     * Add an error message to the search box
     * @param label
     */
    function displaySearchError(label) {
        log.trace("displaySearchError", arguments);

        var $searchInput = $(selector.searchInput),
            $searchLabel = $(selector.searchLabel);

        $searchInput.addClass("ui-error");
        $searchLabel.html(label).slideDown();

        setTimeout(function() {
            $searchInput.removeClass("ui-error");
            $searchLabel.slideUp();
        }, 5000);
    }

    /**
     * Display a league table
     * @param table
     */
    function displayTable(table) {
        log.trace("displayTable", arguments);

        var $table = $(selector.table)
            .empty()
            .append("<tr style='font-weight: bold'><td></td><td>Team</td><td>GW</td><td>Points</td></tr>");

        for(var i = 0; i < table.length; i++) {
            $table.append("<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td><a href='http://fantasy.premierleague.com"+ table[i].url +"' target='_blank'>" +
                    table[i].teamName +
                    "<br/>" +
                    "<small>" + table[i].manager + "</small>" +
                "</a></td>" +
                "<td>" + table[i].gwPoints + "</td>" +
                "<td>" + table[i].points + "</td>" +
            "</tr>")
        }

        $table.fadeIn();
    }

    /**
     * Update the progress bar to a given percentage
     * @param progress
     */
    function updateProgress(progress) {
        var $progress = $(selector.progressBar);
        if(progress <= 0.1 || progress >= 99.9) {
            $progress.width(0).hide();
        } else {
            $progress.width(progress + "%").show();
        }
    }

    /**
     * Show/hide the loading indicator
     * @param isLoading
     */
    function loading(isLoading) {
        if(isLoading) {
            $(selector.loadingIndicator).show();
        } else {
            $(selector.loadingIndicator).hide();
        }
    }

    return {
        selector: selector,
        onSearch: onSearch,
        setSearch: setSearch,
        displaySearchError: displaySearchError,
        displayTable: displayTable,
        updateProgress: updateProgress,
        loading: loading
    }
});