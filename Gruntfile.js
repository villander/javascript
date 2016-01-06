module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    require: 'node.js/tests/tests-include.js',
                    quiet: false
                },
                // NOTICE: ignore test2.js test due it's
                src: ['node.js/tests/ssl_test.js', 'node.js/tests/test.js']
            },
            unit: 'karma.conf.js'
        },
        nodeunit: {
            tests: ['node.js/tests/unit-test.js'],
            options: {}
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ["test:mocha"]);
    grunt.registerTask('test:mocha', ['mochaTest']);
    // TODO: refactor unit testing 
    // grunt.registerTask('test:unit', ['nodeunit']);
};