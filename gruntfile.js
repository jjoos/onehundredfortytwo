module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'dist/onehundredfourtytwo.js': ['src/onehundredfourtytwo.coffee'],
          'dist/actions.js': ['src/actions.coffee'],
          'dist/dispatcher.js': ['src/dispatcher.coffee'],
          'dist/helper.js': ['src/helper.coffee'],
          'dist/store.js': ['src/store.coffee']
        }
      }
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

  grunt.registerTask('default', ['coffeelint', 'coffee']);
};
