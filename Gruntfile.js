'use strict';

module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    mochacov : {
      lib : {
        options : {
          reporter : 'spec',
        },
        src : ['tests/**/*.js']
      },
      coverage : {
        options : {
          reporter : 'html-cov',
          quiet : true,
          output : 'coverage.html'
        },
        src : ['tests/**/*.js']
      },
      'travis-cov' : {
        options : {
          reporter : 'travis-cov'
        },
        src : ['tests/**/*.js']
      },
      coveralls : {
        options : {
          coveralls : process.env.CI
        },
        src : ['tests/**/*.js']
      }
    },
    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      gruntfile : {
        src : 'Gruntfile.js'
      },
      lib : {
        src : ['src/**/*.js']
      },
      tests : {
        src : ['tests/**/*.js']
      },
    },
    watch : {
      gruntfile : {
        files : '<%= jshint.gruntfile.src %>',
        tasks : ['jshint:gruntfile']
      },
      lib : {
        files : '<%= jshint.lib.src %>',
        tasks : ['jshint:lib', 'mochacov']
      },
      tests : {
        files : '<%= jshint.tests.src %>',
        tasks : ['jshint:tests', 'mochacov']
      },
    },
    jsdoc : {
      appjector : {
        src : ['index.js', 'src/**/*.js', 'README.md'],
        options : {
          verbose : true,
          destination : './doc',
          configure : '.jsdoc',
          template : 'node_modules/jaguarjs-jsdoc',
          private : false
        }
      }
    },
    clean : {
      doc : ['./doc'],
      tests : ['./coverage.html']
    },
    'gh-pages' : {
      // your common gh-pages config
      travis : {
        options : {
          repo : 'https://' + process.env.GH_TOKEN + '@github.com/machard/appjector.git',
          silent : true,
          user : {
            name : 'Matthieu Achard',
            email : 'matthieu__@hotmail.fr'
          },
          base : 'doc'
        },
        src : ['**']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch');
  grunt.registerTask('test', ['jshint', 'clean:tests', 'mochacov']);
  grunt.registerTask('doc', ['clean:doc', 'jsdoc:appjector']);

};
