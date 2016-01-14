module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      coreDist: ["core/dist"]
    },
    shell: {
      buildLegacy: {
        command: 'make clean && make'
      }
    },
    webpack: {
      core: {
        // webpack options
        entry: "./core/lib/pubnub-common.js",
        module: {
          loaders: [
            { test: /\.json/, loader: "json" }
          ]
        },
        output: {
          path: "./core/dist",
          filename: "pubnub-core.js",
          library: "PubNubCore",
          libraryTarget: "umd"
        }
      }
    },
    browserify: {
      core: {
        src: ['core/lib/**/*.js'],
        dest: 'core/dist/pubnub-core.js',
        options: {
          external: ['jquery', 'momentWrapper']
        }
      }
    },
    eslint: {
      target: ['node.js/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          require: 'tests/tests-include.js',
          quiet: false
        },
        // NOTICE: ignore test2.js test due it's
        src: ['node.js/**/*.test.js']
      },
      unit: 'karma.conf.js'
    },
    nodeunit: {
      tests: ['tests/unit-test.js'],
      options: {}
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');

  // tasks to build core
  grunt.registerTask('build', ['clean:coreDist', 'webpack:core']);
  grunt.registerTask('build_legacy', ['build', 'shell:buildLegacy']);

  grunt.registerTask('test', ["eslint", "test:mocha", "test:unit"]);
  grunt.registerTask('test:mocha', 'mochaTest');
  grunt.registerTask('test:unit', 'nodeunit');
};