module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        clean: {
            web: 'web',
            partials: 'web/partials/**/*.html',
            images: 'web/images',
            php: 'web/**/*.php',
            tmp: '.tmp'
        },
        watch: {
            fullbuild: {
                files: ['bower.json', 'src/index.html', 'src/css/*', 'src/js/*'],
                tasks: ['clean:web', 'build'],
                debounceDelay: 2000
            },
            htmls: {
                files: ['src/partials/**/*.html'],
                tasks: ['copy:html']
            },
            images: {
                files: ['src/images/*'],
                tasks: ['copy:images']
            },
            php: {
                files: ['src/**/*.php'],
                tasks: ['copy:php']
            }
        },
        ngAnnotate: {
            vendor: {
                files: {
                    '.tmp/concat/js/vendor.js': ['.tmp/concat/js/vendor.js']
                }
            }
        },
        copy: {
            php: {
                src: [ '**/*.php' ],
                dest: 'web/',
                cwd: 'src/',
                expand: true
            },
            html: {
                src: [ '**/*.html' ],
                dest: 'web',
                cwd: 'src',
                expand: true
            },
            images: {
                src: [ '**/*' ],
                dest: 'web/images',
                cwd: 'src/images',
                expand: true
            },
            fafonts: {
                src: ['**/*'],
                dest: 'web/fonts/',
                cwd: 'bower_components/font-awesome/fonts',
                expand: true
            },
            bsfonts: {
                src: ['**/*'],
                dest: 'web/fonts/',
                cwd: 'bower_components/bootstrap/fonts',
                expand: true
            }
        },
        wiredep: {
            deps: {
                src: [ 'src/**/*.html' ],
                exclude: [
                    /.*bower_components.bootstrap.dist.js.bootstrap.js$/,
                    /.*bower_components.jquery.dist.jquery.js$/
                ]
            }
        },
        useminPrepare: {
            html: 'src/**/*.html',
            options: {
                dest: 'web'
            }
        },
        usemin: {
            html: ['web/**/*.html'],
            options: {
                assetsDirs: ['web']
            }
        }
    });

    // simple build task
    grunt.registerTask('build', [
        'wiredep',
        'useminPrepare',
        'copy:html',
        'copy:images',
        'copy:php',
        'copy:fafonts',
        'copy:bsfonts',
        'concat:generated',
        'ngAnnotate:vendor',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'clean:tmp'
    ]);
};