module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  all: ['Gruntfile.js',
    '<%= config.app %>/scripts/{,*/}*.js',
    '!<%= config.app %>/scripts/vendor/*'
  ]
};