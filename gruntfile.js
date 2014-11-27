module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      all: {
        src: 'src/onehundredfourtytwo.coffee',
        dest: 'dist/onehundredfourtytwo.js',
        options: {
          exclude: ['react', 'q'],
          browserifyOptions: {
            debug: true
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

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-coffeelint');

  grunt.registerTask('default', ['coffeelint', 'browserify']);
};
