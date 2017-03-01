var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

/**
 * Compile typescript from ./src to ./js
 */
gulp.task("ts", function () {
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

gulp.task('default', ['ts', 'doT']);
