module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= config.app %>/images',
      src: '{,*/}*.{gif,jpeg,jpg,png}',
      dest: '<%= config.dist %>/images'
    }]
  }
};