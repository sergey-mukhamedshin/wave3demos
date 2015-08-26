connect = require 'connect'
gulp = require 'gulp'
http = require 'http'
pkg = require './package.json';
tasks = (require 'gulp-load-plugins')()

src = [
  'src/js1.6.js'
  'src/js-ext.js'
  'src/q.js'
  'src/load.js'
  'src/platform.js'
  'src/console.js'
  'src/i18n.js'
  'src/settings.js'
  'src/main.js'
]
dst = '../cdn/'

banner = "ztv = {version: '<%= pkg.version %>'};\n\n"

gulp.task 'jshint', ->
  return gulp.src(src)
    .pipe(tasks.jshint())
    .pipe(tasks.jshint.reporter('default'))

gulp.task 'unit', ->
  return gulp.src([
    dst + 'ztv.js'
    'test/unit/**/*.js'
  ])
    .pipe(tasks.karma(configFile: 'test/karma-ztv.conf.js'))

gulp.task 'test', ['jshint', 'build'], ->
  s = http.createServer(
    connect()
      .use(connect.static(require('path').resolve('')))
  )
  s.listen(8888)

  gulp.run 'unit', ->
    s.close()

gulp.task 'build', ->
  return gulp.src(src)
    .pipe(tasks.concat('ztv.js'))
    .pipe(tasks.header(banner, pkg: pkg))
    .pipe(gulp.dest(dst))

gulp.task 'default', ['build']
