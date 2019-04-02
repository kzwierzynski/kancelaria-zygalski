const gulp = require('gulp');
// const { src, dest, task, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

const jsPath = 'src/js/';
const jsEntryPath = 'src/js/entry/';
const jsFiles = ['index.js', 'about.js', 'services.js', 'contact.js'];
const jsBundleFiles = ['index.min.js', 'about.min.js', 'services.min.js', 'contact.min.js', 'sidebar-mobile.js'];

// Compile sass into CSS & auto-inject into browsers
function cssProd() {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
};

function js(done) {
    jsFiles.map(entry => {
        return browserify({
            entries: [jsEntryPath + entry]
        })
        .transform(babelify, { presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsPath));
        // .pipe(browserSync.stream());
    });
    done();
};

function cssBuild() {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
};

// // Move the css and javascript files into our /src/js folder
function cssCopy() {
    return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
};

function jsCopy() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest('src/js'))
        .pipe(browserSync.stream());
};

function htmlBuild() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'));
};

function imgCopy() {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
};

function jsBuild(done) {
    jsBundleFiles.map(entry => {
        return gulp.src(jsPath + entry)
        .pipe(gulp.dest('dist/js'))
    });
    done();
};

// Static Server + watching scss/html files
function serve(done) {
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });
    done();
};

function watchFiles() {
    gulp.watch('src/scss/*.scss', cssProd);
    gulp.watch('src/*.html').on('change', browserSync.reload);
    gulp.watch('src/js/entry/*.js').on('change', gulp.series(js, browserSync.reload));
}

// gulp.task('default', gulp.series(cssProd, js, serve, watchFiles));
gulp.task('default', gulp.series(serve, watchFiles));

// gulp.task('start', cssProd);
gulp.task('js', js);
gulp.task('cssCopy', cssCopy);
gulp.task('jsCopy', jsCopy);
gulp.task('build', gulp.series(htmlBuild, imgCopy, cssBuild, jsBuild));