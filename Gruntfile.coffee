module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      glob_to_multiple:
        expand: true
        flatten: true
        src: ['js/*.coffee']
        dest: 'public/js'
        ext: '.js'

    sass:
      dist:
        files:
          [{
            expand: true
            src: [ 'css/*.scss' ]
            dest: 'public'
            ext: '.css'
          }]

    slim:
      dist:
        files:
          [{
            expand: true
            src: ['*.slim']
            dest: ''
            ext: '.html'
            }]

    watch:
      options:
        livereload: true
      sass:
        files: 'css/**/*.sass'
        tasks: ['sass']
      coffee:
        files: 'js/**/*.coffee'
        tasks: ['coffee']
      slim:
        files: '**/*.slim'
        tasks: ['slim']

  # Load external plugins.
  grunt.loadNpmTasks 'grunt-slim'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  # Default task(s).
  grunt.registerTask 'default', [ 'watch' ]
  return
