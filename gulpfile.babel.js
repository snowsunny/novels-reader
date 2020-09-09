import gulp from 'gulp'
import gulpCson from 'gulp-cson'

export default function() {
  return gulp
    .src('./src/manifest.cson')
    .pipe(gulpCson())
    .pipe(gulp.dest('./novels-reader-crx/'))
}