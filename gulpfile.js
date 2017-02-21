var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    queue = require('gulp-sequence'),
    contentIncluder = require('gulp-content-includer'),
    packageJson = require('./package.json');

function branch(_path) {
    return function(r) {
        return _path + (r||'');
    }
}

var path = {
    src: {
        root: branch(packageJson.path.src),
        less: branch(packageJson.path.src + 'static/less/'),
        js: branch(packageJson.path.src + 'static/js/'),
        page: branch(packageJson.path.src + 'static/js/page')
    },
    dist: {
        root: branch(packageJson.path.dist),
        css: branch(packageJson.path.dist + 'static/css'),
        js: branch(packageJson.path.dist + 'static/js'),
        img: branch(packageJson.path.dist + 'static/css/image')
    }
}

// compile less
gulp.task('less', function() {
    return gulp.src([
            path.src.less('main.less')
        ])
        .pipe($.less())
        .pipe(gulp.dest(path.dist.css()));
})
gulp.task('concat', function() {
    return gulp.src([
            path.src.js('plugin/**/*.js'),
            path.src.js('core/**/*.js'),
            path.src.js('componements/**/*.js'),
            path.src.js('app.js')
        ])
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(path.dist.js()));
})
gulp.task('clean', function() {
    return gulp.src('dist').pipe($.clean());
})
gulp.task('html', function() {
	return gulp.src(path.src.root('templates/**/*.html'))
		.pipe(contentIncluder({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(gulp.dest(path.dist.root('templates')));
})
gulp.task('copy', function() {
    return gulp.src([
            path.src.root('templates/**/*.html'),
            path.src.root('app.html'),
            path.src.js('vendor/**/*.js'),
            path.src.js('page/**/*.js'),
            path.src.root('static/css/img/**/*'),
            path.src.root('iframe/**/*.html'),
            path.src.root('defs/**/*.html')
        ])
        .pipe($.copy('dist', {prefix: 1}))
})
gulp.watch(path.src.root('**/*'), ['default']);

gulp.task('default', function(cb) {
    queue(
        'clean',
        'copy',
        'html',
        'less',
        'concat',
        cb);
});
gulp.task('release', function(cb) {
    queue(
        cb)
})