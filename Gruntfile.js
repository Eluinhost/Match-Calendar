module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        clean: {
            web: 'web',
            partials: 'web/partials/**/*.html',
            images: 'web/images',
            php: 'web/**/*.php'
        },
        copy: {
            php: {
                src: [ '**/*.php' ],
                dest: 'web/',
                cwd: 'src/',
                expand: true
            },
            partials: {
                src: [ '**/*.html' ],
                dest: 'web/partials',
                cwd: 'src/partials',
                expand: true
            },
            images: {
                src: [ '**/*' ],
                dest: 'web/images',
                cwd: 'src/images',
                expand: true
            }
        }
    });
};