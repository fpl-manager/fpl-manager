require.config({
  shim: {

  },
  paths: {
    main: "./scripts/main",
    ratelimitedajax: "./scripts/utils/ratelimitedajax",
    ui: "./scripts/utils/ui",
    leagues: "./scripts/utils/leagues",
    jquery: "bower_components/jquery/dist/jquery",
    loglevel: "bower_components/loglevel/dist/loglevel.min",
    underscore: "bower_components/underscore/underscore-min"
  },
  packages: [

  ]
});
require( ["main"] );
