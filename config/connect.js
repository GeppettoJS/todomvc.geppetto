module.exports = function( grunt,
                           opts ){

    var config = opts.config;
    return {
        options    : {
            port       : 9000,
            open       : true,
            livereload : 35729,
            hostname   : 'localhost'
        },
        livereload : {
            options : {
                middleware : function( connect ){
                    return [
                        connect.static( '.tmp' ),
                        connect().use( '/bower_components', connect.static( './bower_components' ) ),
                        connect.static( config.app )
                    ];
                }
            }
        },
        dist       : {
            options : {
                base       : '<%= config.dist %>',
                livereload : false
            }
        }
    };
};
