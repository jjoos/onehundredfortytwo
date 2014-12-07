var transform = require('coffee-react-transform');
var coffee = require('coffee-script');

module.exports = {
  process: function(src, path) {
    if (coffee.helpers.isCoffee(path)) {
      coffee_script = transform(src);
      return coffee.compile(coffee_script, {'bare': true});
    } else {
      return src;
    }
  }
};