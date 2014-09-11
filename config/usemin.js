module.exports = {
  options: {
    assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
  },
  html: ['<%= config.dist %>/{,*/}*.html'],
  css: ['<%= config.dist %>/styles/{,*/}*.css']
};