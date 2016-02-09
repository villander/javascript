module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      coreDist: ['parse/dist']
    },
    env: {
      lockdown: {
        VCR_MODE: 'playback'
      },
      record: {
        VCR_MODE: 'cache'
      }
    },
    exec: {
      make_clean: 'make clean',
      make: 'make'
    },
    mocha_istanbul: {
      coverage_integration: {
        src: 'node.js/tests/integration/',
        options: {
          coverageFolder: 'coverage/integration',
          mask: '**/*.test.js',
          print: 'none'
        }
      },
      coverage_unit: {
        src: 'node.js/tests/unit',
        options: {
          mochaOptions: ['--bail'],
          coverageFolder: 'coverage/unit',
          mask: '**/*.test.js',
          print: 'none'
        }
      },
      old: {
        src: 'node.js/tests/legacy',
        options: {
          coverageFolder: 'coverage/old',
          mask: 'integration_test.js',
          print: 'none'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage/**',
          check: {}
        }
      }
    },
    webpack: {
      parse: {
        // webpack options
        entry: './parse/lib/platform.js',
        module: {
          loaders: [
            { test: /\.json/, loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
          ]
        },
        output: {
          path: './parse/dist',
          filename: 'pubnub.js',
          library: ['PUBNUB'],
          libraryTarget: 'umd'
        },
        externals: ['crypto', 'buffer']
      }
    },
    eslint: {
      target: [
        'node.js/tests/integration/stubbed/**/*.js',
        'node.js/tests/unit/**/*.js',
        'node.js/*.js',
        'node.js/lib/*.js',
        'parse/lib/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('lockdown', ['env:lockdown']);
  grunt.registerTask('record', ['env:record']);

  grunt.registerTask('compile', ['clean', 'exec:make_clean', 'exec:make', 'webpack']);

  grunt.registerTask('test-old', ['mocha_istanbul:old']);
  grunt.registerTask('test-unit', ['mocha_istanbul:coverage_unit']);
  grunt.registerTask('test-integration', ['mocha_istanbul:coverage_integration']);

  grunt.registerTask('test', ['test-unit', 'test-integration', 'istanbul_check_coverage', 'eslint']);
  grunt.registerTask('test-record', ['env:test_record', 'mocha_istanbul:coverage_integration']);
};
