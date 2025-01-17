// eslint-disable-next-line strict
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> by Matt Zabriskie */\n'
    },

    clean: {
      dist: 'dist/**'
    },

    package2bower: {
      all: {
        fields: [
          'name',
          'description',
          'version',
          'homepage',
          'license',
          'keywords'
        ]
      }
    },

    package2env: {
      all: {}
    },

    eslint: {
      target: ['lib/**/*.js']
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      single: {
        singleRun: true
      },
      continuous: {
        singleRun: false
      }
    },

    mochaTest: {
      test: {
        src: ['test/unit/**/*.js']
      },
      options: {
        timeout: 30000
      }
    },

    watch: {
      build: {
        files: ['lib/**/*.js'],
        tasks: ['build']
      },
      test: {
        files: ['lib/**/*.js', 'test/**/*.js', '!test/typescript/axios.js', '!test/typescript/out.js'],
        tasks: ['test']
      }
    },

    shell: {
      rollup: {
        command: 'rollup -c -m'
      }
    }
  });

  grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function() {
    var npm = grunt.file.readJSON('package.json');
    var bower = grunt.file.readJSON('bower.json');
    var fields = this.data.fields || [];

    for (var i = 0, l = fields.length; i < l; i++) {
      var field = fields[i];
      bower[field] = npm[field];
    }

    grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
  });

  grunt.registerMultiTask('package2env', 'Sync package.json to env.json', function() {
    var npm = grunt.file.readJSON('package.json');
    grunt.file.write('./lib/env/data.js', [
      'module.exports = ',
      JSON.stringify({
        version: npm.version
      }, null, 2),
      ';'].join(''));
  });

  grunt.registerTask('test', 'Run the jasmine and mocha tests', ['mochaTest']);
  grunt.registerTask('build', 'Run rollup and bundle the source', ['clean', 'shell:rollup']);
  grunt.registerTask('version', 'Sync version info for a release', ['package2bower', 'package2env']);
};
