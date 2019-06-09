const gulp = require('gulp');
const htmlInclude = require("gulp-include-html");
const less = require('gulp-less');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
var injectSvg = require('gulp-inject-svg');
var injectSvgOptions = { base: '/app' };

const jsFiles = [
	'app/js/chessboard-0.3.0.js',
	'app/js/main.js',
]

function html() {
	return gulp.src('app/html/**/*.html')
		.pipe(htmlInclude({
			baseDir:'app/html/',
			ignore: /_includes/
		}))
		.pipe(injectSvg(injectSvgOptions))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
}

function styles() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass.sync().on('error', sass.logError))
	// .pipe(autoprefixer({
	// 	browsers: ['> 0.1%'],
	// 	cascade: false
	// }))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream());;
}

function scripts() {
	return gulp.src(jsFiles)
		.pipe(concat('scripts.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
}

function img() {
	return gulp.src('app/img/*')
		.pipe(gulp.dest('dist/img'))
}

function fonts() {
	return gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'))
}

function watch(){
	browserSync.init({
		server: {
			baseDir: "dist/"
		},
		tunnel: true
	});
	gulp.watch('app/html/**/*.html', html);
	gulp.watch('app/sass/**/*.scss', styles);
	gulp.watch('app/js/**/*.js', scripts);
}

function clean(){
	return del(['dist/*'])
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('img', img);
gulp.task('fonts', fonts);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build', gulp.series(clean,
	gulp.parallel(html, styles, scripts, img, fonts)
));
gulp.task('dev', gulp.series('build', 'watch'));