/*global module:false*/
module.exports = function(grunt) {

    var shellOpts = {
        stdout: true,
        failOnError: true
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! html-bind - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +

                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Itay Kinnrot; Licensed GNU */\n'
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: [
                    'src/HTMLBind.js'
                ],
                dest: 'HTMLBind-full.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                files: {
                    'HTMLBind-full.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }

    });

    // Add grunt plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  //  grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', ['concat:dist', 'uglify:dist']);
    grunt.registerTask('deploy', ['default', 'shell:copyLatest']);

};
