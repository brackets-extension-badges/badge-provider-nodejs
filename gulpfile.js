const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

/**
 * Compile typescript from ./src to ./js
 */
gulp.task('ts', () => {
	const tsProject = ts.createProject('tsconfig.json');
	return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('js'));
});

/**
 * Compile doT.js templates
 */
gulp.task('doT', () => {
	require('dot').process({path: './views'});
});

/**
 * Check code style with tslint
 */

gulp.task('tslint', () => {
	gulp.src('src/*.ts')
        .pipe(tslint({
	formatter: 'stylish'
}))
        .pipe(tslint.report());
});

gulp.task('default', ['ts', 'doT']);

gulp.task('all', ['ts', 'doT', 'tslint']);
