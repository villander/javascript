module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      coreDist: ["core/dist", "modern/dist"]
    },
    shell: {
      buildLegacy: {
        command: 'make clean && make'
      }
    },
    uglify: {
      modernWeb: {
        files: {
          'modern/dist/pubnub.min.js': ['modern/dist/pubnub.js']
        }
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
      },
      modernWeb: {
        // webpack options
        entry: "./modern/lib/modern.js",
        module: {
          loaders: [
            { test: /\.json/, loader: "json" }
          ]
        },
        output: {
          path: "./modern/dist",
          filename: "pubnub.js",
          library: "PUBNUB",
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
      target: ['node.js/*.js', 'modern/lib/**.js', 'parse/*.js', 'core/vendor/crypto/crypto-obj.js']
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
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // tasks to build core
  grunt.registerTask("minify", ["uglify:modernWeb"]);
  grunt.registerTask('build', ['clean:coreDist', 'webpack:core', 'webpack:modernWeb', "minify"]);
  grunt.registerTask('build_legacy', ['build', 'shell:buildLegacy']);

  grunt.registerTask('test', ["eslint", "test:mocha", "test:unit"]);
  grunt.registerTask('test:mocha', 'mochaTest');
  grunt.registerTask('test:unit', 'nodeunit');
};