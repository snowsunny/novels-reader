import gulp from 'gulp'
import gulpCson from 'gulp-cson'
import gulpPlumber from 'gulp-plumber'

import runSequence from 'run-sequence'

gulp.task('default', (cb) => {
  runSequence('cson', cb)
})

gulp.task('dev', (cb) => {
  runSequence('default', 'watch', cb)
})

gulp.task('watch', () => {
  gulp.watch('src/manifest.cson', ['default'])
})

gulp.task('cson', () => {
  return gulp.src('./src/manifest.cson')
    .pipe(gulpPlumber({
      errorHandler(errorInfo) {
        console.log(errorInfo)
        this.emit('end')
      }
    }))
    .pipe(gulpCson())
    .pipe(gulp.dest('./narou-reader/'))
})
