module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
        
        clean: {
            js:'dist/**/*'
        },

        jshint: ['Gruntfile.js'],	
        pkg: grunt.file.readJSON('package.json'),

        concat:{
			dist: {
        			src: [ 
            				'src/ui/js/libs/*.js' 
                            ,'src/ui/js/basemodules/*.js'
                            ,'src/ui/js/uimodules/*.js'
            				,'src/ui/js/*.js'
        			],
        			dest: 'dist/ui/js/vwp.js'
    			},
			css: {
        			src: [
                        'src/ui/css/bootstrap.css',
            			'src/ui/css/custom.css' 
        			],
        			dest: 'dist/ui/css/vwp.css'
    			}
		},
		uglify: {
    			build: {
        			src: 'dist/ui/js/vwp.js',
        			dest: 'dist/ui/js/vwp.min.js'
    			}
		},
        copy: {
          main: {
            files: [
              // includes files within path
              {flatten: true, expand: true, src: ['src/ui/index.html'], dest: 'dist/ui/'},
              {flatten: true, expand: true, src: ['src/backend/**/*.js'], dest: 'dist/backend/'},
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
	// Default task(s).
	grunt.registerTask('default', ['concat', 'copy', 'watch', 
        'jshint', 'clean']);

};
