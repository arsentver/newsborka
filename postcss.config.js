module.exports = {
  'plugins': {
    'postcss-nested': {},
    'autoprefixer': {
      browsers: ['last 2 versions'],
      flexbox: false,
      cascade: false
    },
    'css-mqpacker': {sort: true},
    'postcss-csso': {restructure: false}
  }
}