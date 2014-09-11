module.exports = {
  server: ['copy:styles'],
  dist: ['copy:styles', 'imagemin', 'svgmin']
};