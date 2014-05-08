/*global module:false*/
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '0.1.0'
    },

    concat: {
      options: {

    banner: '\n/*! <%= pkg.name %>.jsx - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        stripBanners: false
      },
      scripts: {
        src: [
        'src/tilemill/license.jsx',
        'src/tilemill/globals.jsx',
        'src/tilemill/util.jsx',
        'src/tilemill/document.jsx',
        // 'src/lib/extendscript.geo/dist/extendscript.geo.id.jsx',
        // 'src/lib/extendscript.csv/dist/extendscript.csv.jsx',
        'src/tilemill/importer.jsx',
        'src/tilemill/marker.jsx',
        // 'src/tilemill/MercatorMap.jsx',
        'src/tilemill/geo.jsx',
        'src/tilemill/main.jsx'],
        dest: 'src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'
      }
    },

    copy: {
      "script": {
        src: "src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx",
        dest: "dist/<%= pkg.name %>.<%= pkg.version %>.jsx",
      },
    },
     /**
     * wrap it
     */
    wrap: {
      'script': {
        src: ['src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'],
        dest: 'src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx',
        options: {
                    wrapper: ['(function(thisObj) {', '})(this);\n']
        },
      },
    },
    watch: {
      files: ['src/tilemill/*', 'src/lib/*'],
      tasks: ['concat:scripts', 'wrap:script','copy:script']
    }

  });
  grunt.registerTask('build-dist', ['concat:scripts', 'wrap:script','copy:script']);

  grunt.registerTask('default', ['watch']);

};
