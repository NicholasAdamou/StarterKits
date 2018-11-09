const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });

const autoprefixer = require('autoprefixer');
const rucksack = require('rucksack-css');
const bourbon = require('node-bourbon');
const neat = require('node-neat');
const lost = require('lost');

const paths = require('../../paths.js');
const config = require('../../config.js')();

gulp.task('sass', () => {
  const env = ((config.environment || process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');


  const sass = {
    sourceComments: (config.sassOptions.sourceComments).trim().toLowerCase() ? !env : '',
    outputStyle: (config.sassOptions.outputStyle).trim().toLowerCase() ? !env : 'compressed',
    imagePath: config.sassOptions.imagePath,
    precision: config.sassOptions.precision || 3,
    includePaths: [
      bourbon.includePaths,
      neat.includePaths,
    ],
    errLogToConsole: true,
  };


  const plugins = [
    lost(),
    rucksack(),
    autoprefixer({
      browsers: [
        '> 1%',
        'last 2 versions',
        'firefox >= 4',
        'safari 7',
        'safari 8',
        'IE 8',
        'IE 9',
        'IE 10',
        'IE 11',
      ],
    }),
  ];

  console.log(`-> Compiling SASS for ${config.environment}`);

  if (env) {
    // Select files
    gulp.src(`${paths.to.sass.in}/*.scss`)
    // Prevent pipe breaking caused by errors from gulp plugins
      .pipe($.plumber())
    // Initialize sourcemaps
      .pipe($.sourcemaps.init())
    // Compile Sass
      .pipe($.sass(sass).on('error', $.sass.logError))
    // Add vendor prefixes
      .pipe($.postcss(plugins))
    // Concatenate includes
      .pipe($.include({
        includePaths: [
          `${config.root}/bower_components`,
          `${config.root}/node_modules`,
        ],
      }))
    // Save sourcemaps
      .pipe($.sourcemaps.write(paths.to.sass.out))
    // Save unminified file
      .pipe(gulp.dest(`${paths.to.sass.out}`));
  } else {
    // Select files
    gulp.src(`${paths.to.sass.in}/*.scss`)
    // Prevent pipe breaking caused by errors from gulp plugins
      .pipe($.plumber())
    // Compile Sass
      .pipe($.sass(sass).on('error', $.sass.logError))
    // Add vendor prefixes
      .pipe($.postcss(plugins))
    // Concatenate includes
      .pipe($.include({
        includePaths: [
          `${config.root}/bower_components`,
          `${config.root}/node_modules`,
        ],
      }))
    // Show file-size before compression
      .pipe($.size({ title: 'sass In Size' }))
    // Optimize and minify
      .pipe($.cssnano())
    // Show file-size after compression
      .pipe($.size({ title: 'sass Out Size' }))
    // Append suffix
      .pipe($.rename({
        suffix: '.min',
      }))
    // Save minified file
      .pipe(gulp.dest(`${paths.to.sass.out}`));
  }
});
