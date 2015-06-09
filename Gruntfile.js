module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
    		pkg: grunt.file.readJSON('package.json'),
		concat:{
			dist: {
        			src: [ 
            				'src/ui/js/libs/*.js' // All JS in the libs folder
                            ,'src/ui/js/basemodules/*.js'
                            ,'src/ui/js/uimodules/*.js' // all js modules
            				,'src/ui/js/*.js'  // This specific file
                            
        			],
        			dest: 'dist/ui/js/vwp.js'
    			},
			
			css: {
        			src: [
            				'src/ui/css/*.css' // All css
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
              {flatten: true, expand: true, src: ['src/ui/img/*'], dest: 'dist/ui/img'}
            ],
          },
        },
		watch: {
    			scripts: {
        			files: ['src/ui/**/*.js', 'src/ui/**/*.css', ],
        			tasks: ['concat'],
        			options: {
            				spawn: false
        			},
    			} ,
                scripts: {
                    files: ['src/backend/**/*.js', 'src/ui/index.html'],
                    tasks: ['copy'],
                    options: {
                            spawn: false
                    }
                } 
		}

	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'copy', 'watch']);

};
