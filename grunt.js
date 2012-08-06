/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // the staging directory used during the process
    staging: 'intermediate',
    // final build output
    output: 'publish',

    // Create the build dirs
    mkdirs: {
      staging: './'
    },

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'css/style.css': ['css/**/*.css']
    },

    // Renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'js/**/*.js',
      css: 'css/**/*.css',
      img: 'img/**'
    },

    // update references in html to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // html minification
    html: {
      files: '<config:usemin.html>'
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },

    
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'js/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    rjs: {
      almond: true,
      modules: [{
        name: 'main'
      }],
      dir: 'js/',
      appDir: 'js',
      baseUrl: './',
      paths: {
        jquery: 'vendor/jquery-1.7.2',
        underscore: 'vendor/underscore-1.3.3',
        backbone: 'vendor/backbone-0.9.2',
        text: 'vendor/text-2.0.1'
      },
      pragmas: {
        doExclude: true
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    }
  });

  
  // in rjs setup, the concat and min task are overriden to use rjs optimizr
  grunt.renameTask('concat', '_concat').registerTask('concat', 'rjs (noop)', function() {
    grunt.log.writeln('the concat in rjs setup is a noop, rjs optimizer somewhat replace js concatenation');
  });
  grunt.renameTask('min', '_min').registerTask('min', 'rjs');
  

  // uncomment this line if you're using the build script as a grunt plugin
  // it should be installed locally, even better if put in your package.json's
  // dependency
  //
  // grunt.loadNpmTasks('node-build-script');
};
