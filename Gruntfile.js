module.exports = function (grunt) {
    grunt.initConfig({
        env: {
            test_lockdown: {
                "VCR_MODE": "playback"
            },
            test_record: {
                "VCR_MODE": "cache"
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    quiet: false
                },
                // NOTICE: ignore test2.js test due it's
                src: ['node.js/tests/**/*.test.js']
            },
            unit: 'karma.conf.js'
        },
        nodeunit: {
            tests: ['node.js/tests/unit-test.js'],
            options: {}
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['env:test_lockdown', "test:mocha"]);
    grunt.registerTask('test-record', ['env:test_record', "test:mocha"]);
    grunt.registerTask('test:mocha', ['mochaTest']);
    // TODO: refactor unit testing
    // grunt.registerTask('test:unit', ['nodeunit']);
};