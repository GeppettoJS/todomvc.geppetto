'use strict';

module.exports = function(grunt, opts){
    return {
        tasks : {
            browserify : {
                dist : {
                    files : {
                        '.tmp/scripts/main.js' : ['<%= config.app %>/scripts/**/*.js']
                    }
                }
            }
        }
    }
}
