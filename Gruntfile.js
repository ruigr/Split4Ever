module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
        cafemocha: {
            all: { 
                src: 'qa/*-*Test.js', 
                options: { 
                    ui: 'tdd' , 
                    reporter: 'nyan',
                }, 
            }
        }
        ,concurrent: {
          dev: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true,
            }
          }
        },
        clean: {
            js: [ 'dist/backend', 'dist/ui' ]
        },
        nodemon: {
          dev: {
            script: 'dist/backend/index.js',
            options: {
                logConcurrentOutput: true,
                nodeArgs: ['--debug'],
                env: {
                          "NODE_ENV": "development"
                        , "NODE_CONFIG": "dev"
                },
                watch: ["server"],
                callback: function (nodemon) {
                    nodemon.on('log', function (event) {
                      console.log(event.colour);
                    });
                    // opens browser on initial server start 
                    nodemon.on('config:update', function () {
                      // Delay before server listens on port 
                      setTimeout(function() {
                        require('open')('http://localhost:3000');
                      }, 1000);
                    });
                    // refreshes browser when server reboots 
                    nodemon.on('restart', function () {
                      // Delay before server listens on port 
                      setTimeout(function() {
                        require('fs').writeFileSync('.rebooted', 'rebooted');
                      }, 1000);
                    });
                }
            }
          }
        },
        jshint: ['Gruntfile.js'],	
        pkg: grunt.file.readJSON('package.json'),
        concat:{
			dist: {
        			src: [ 
            				'src/ui/js/libs/*.js' 
                            ,'src/ui/js/base/*.js'
                            ,'src/ui/js/common/*.js'
                            //,'src/ui/js/**/*.js'
            				,'src/ui/js/*.js'
        			],
        			dest: 'dist/ui/js/main.js'
    			},
			css: {
        			src: [
                        'src/ui/css/bootstrap.css',
            			'src/ui/css/custom.css' 
        			],
        			dest: 'dist/ui/css/main.css'
    			}
		},
		uglify: {
    			build: {
        			src: 'dist/ui/js/main.js',
        			dest: 'dist/ui/js/main.min.js'
    			}
		},
        copy: {
          main: {
            files: [
              // includes files within path
              {flatten: true, expand: true, src: ['src/ui/index.html'], dest: 'dist/ui/'},
              { expand: true, cwd: 'src/backend/',  src: ['**'], dest: 'dist/backend/'},
              {flatten: true, expand: true, src: ['src/ui/img/*'], dest: 'dist/ui/img/'}
            ],
          }
        },
		watch: {
    			uijsandcss: {
        			files: ['src/ui/js/**/*.js', 'src/ui/css/*.css', 
                        'src/backend/**/*.js', 'src/ui/index.html', 'src/ui/img/*' ],
        			tasks: ['clean', 'concat', 'copy'],
        			options: {
            				spawn: false
        			}
    			},
                server: {
                    files: ['.rebooted'],
                    options: {
                        options: { nospawn: true, livereload: true }
                    }
                }
		}

	});
	// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-cafe-mocha');
	// Default task(s).
	grunt.registerTask('default', ['concat', 'copy', 'watch', 
        'jshint', 'clean', 'cafemocha', 'nodemon' ]);

};
