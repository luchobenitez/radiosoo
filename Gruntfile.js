'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-githooks');
//  grunt.loadNpmTasks('grunt-karma');
//  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks('grunt');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: 'checkstyle'
      },
      src: [
        'GruntFile.js',
        'src/**/*.js',
        '!src/public/lib/**',
        '!src/public/js/**'
      ]
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: 'checkstyle'
      },
      src: [
        'GruntFile.js',
        'src/**/*.js',
        '!src/public/lib/**',
        '!src/public/js/**'
      ]
    },
    githooks: {
      all: {
        options: {
          endMarker: ''
        },
        'pre-commit': 'analyze',
        'post-checkout': 'shell:gitlog',
        'post-commit': 'shell:gitlog',
        'post-merge': 'shell:gitlog shell:npminstall'
      }
    },
    shell: {
      gitlog: {
        command: 'git log -1 > git-info.txt'
      },
      npminstall: {
        command: 'npm install'
      },
      serverLogs: {
        command: 'pm2 logs'
      },
      serverStatus: {
        command: 'pm2 list'
      },
      serverStop: {
        command: 'pm2 kill'
      },
      serverDelete: {
        command: 'pm2 delete pm2.json'
      },
      serverStart: {
        command: 'pm2 start pm2.json'
      },
      logClean: {
        command: 'rm -f logs/*.log'
      }
    },
    mochaTest: {
      all: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*Test.js', '!test/public/js/**/*Test.js']
      }
    },
    karma: {
      client: {
        configFile: 'karma.conf.js'
      }
    },
    stylus: {
      compile: {
        options: {
          compress: false,
          paths: ['source/stylus']
        },
        files: {
          'src/stylus/radiosoo.css': 'src/stylus/radiosoo.styl'
        }
      }
    },
    csscomb: {
      radiosoo: {
          files: {
              'src/stylus/radiosoo.css': ['src/public/css/radiosoo.css'],
          }
      }
    },

    csslint: {
       options: {
           force: true,
           absoluteFilePathsForFormatters: true,
           formatters: [
               {id: 'compact', dest: 'quality/report/css/compact.xml'}
           ]
       },
       strict:{
           options:{
               force: true,
               import:2,
               "box-model":false,
           },
           src:['src/public/css/*.css'],
       },
       lax: {
            options: {
                import: false
            },
       src: ['src/public/css/radiosoo.css']
      }
    }
  });

  grunt.registerTask('default', ['analyze']);
  grunt.registerTask('css', ['stylus', 'csscomb', 'csslint']);
  grunt.registerTask('test', 'Runs unit tests', ['mochaTest', 'karma:client']);
  grunt.registerTask('analyze', 'Validate code style', ['jshint', 'jscs']);
};
