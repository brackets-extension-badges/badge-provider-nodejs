var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

/**
 * Compile typescript from ./src to ./js
 */
gulp.task("ts", function () {
    var tsProject = ts.createProject("tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("js"));
});

/**
 * Compile doT.js templates
 */
gulp.task("doT", function () {
    require("dot").process({path: "./views"});
});

/**
 * Check code style with tslint
 */

gulp.task("tslint", function () {
    gulp.src("src/*.ts")
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report())
});

gulp.task('default', ['ts', 'doT']);

gulp.task('all', ['ts', 'doT', 'tslint']);
