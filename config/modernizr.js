module.exports = {
  dist: {
    devFile: 'bower_components/modernizr/modernizr.js',
    outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
    files: {
      src: ['<%= config.dist %>/scripts/{,*/}*.js',
        '<%= config.dist %>/styles/{,*/}*.css',
        '!<%= config.dist %>/scripts/vendor/*'
      ]
    },
    uglify: true
  }
};