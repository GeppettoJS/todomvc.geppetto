// Generated on 2014-06-26 using generator-webapp 0.4.9
'use strict';

var konfy = require('konfy');
konfy.loadEnv();

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function( grunt ){

    // Time how long tasks take. Can help when optimizing build times
    require( 'time-grunt' )( grunt );

    // Load grunt tasks automatically
    require( 'jit-grunt' )( grunt, {
        useminPrepare : 'grunt-usemin',
        'gh-pages-clean' : 'grunt-gh-pages'
    } );

    // Configurable paths
    var config = {
        app  : 'app',
        dist : 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig( require( 'load-grunt-configs' )( grunt, {
        config : config
    } ) );

    grunt.registerTask( 'serve', function( target ){
        if( target === 'dist' ){
            return grunt.task.run( ['build', 'connect:dist:keepalive'] );
        }

        grunt.task.run( [
            'clean:server',
            'browserify',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ] );
    } );
    
    grunt.registerTask( 'build', [
        'clean:dist',
        'browserify',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'modernizr',
        'rev',
        'usemin',
        'htmlmin'
    ] );
    
    grunt.registerTask( 'publish', [
        'default',
        'gh-pages'
    ]);

    grunt.registerTask( 'default', [
        'newer:jshint',
        'build'
    ] );
};
