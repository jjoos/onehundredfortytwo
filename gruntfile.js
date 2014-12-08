module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'node/onehundredfortytwo.js': ['src/onehundredfortytwo.coffee'],
          'node/actions.js': ['src/actions.coffee'],
          'node/dispatcher.js': ['src/dispatcher.coffee'],
          'node/helper.js': ['src/helper.coffee'],
          'node/store.js': ['src/store.coffee']
        }
      }
    },

    browserify: {
      all: {
        src: 'src/onehundredfortytwo.coffee',
        dest: 'bower/onehundredfortytwo.js',
        options: {
          exclude: ['react', 'q'],
          browserifyOptions: {
            extensions: ['.coffee', '.cjsx', '.js'],
            standalone: 'onehundredfortytwo',
            debug: false
          },
          transform: ['coffee-reactify']
        }
      },
    },

    coffeelint: {
      app: ['src/**/*.coffee'],
      options: {
        configFile: 'coffeelint.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['coffeelint', 'coffee', 'browserify']);
};
