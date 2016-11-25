var gulp = require('gulp');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var nib = require('nib');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babel = require('babelify');
var watchify = require('watchify');




gulp.task('styles', function(){
	gulp.src('./styles/main.styl')
	.pipe(stylus({use:nib()}))
	.pipe(rename('app.css'))
	.pipe(gulp.dest('./public'))
})

function compile(watch){
	var bundle = watchify(browserify('./scripts/index.js'));

	function rebundle(){
		bundle
			.transform(babel)
			.bundle()
			.on('error', function(err){
				console.log(err);
				this.emit('end')
			})
			.pipe(source('index.js'))
			.pipe(rename('app.js'))
			.pipe(gulp.dest('public'))
	}
	if(watch){
		bundle.on('update', function(){
			console.log('Bundling --->')
			rebundle();
		})
	}

	rebundle();
}

gulp.task('bundle', function(){
	compile();
})


gulp.task('watchJs', function(){
	compile(true);
})

gulp.task('watchStyles', function(){
 		gulp.watch(['./styles/*.styl'], ['styles']);

 	});



gulp.task('default', ['styles', 'watchJs', 'watchStyles'])