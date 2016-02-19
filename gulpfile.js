var gulp = require("gulp");
var plugin = require("gulp-load-plugins")();
var ts = plugin.typescript;

gulp.task('watch',["watch-server","watch-client","start","jade","less"]);

var srcServer = ['src/server/**/*.ts'];
gulp.task('watch-server', ['compile-server'], watchServer);
gulp.task('compile-server', compileServer);
gulp.task('start', function () {
  plugin.nodemon({
  nodeArgs: ["--debug"]
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  , watch:["src/server/"]
  })
})

gulp.task('jade', function () {
  var jadeFiles = "src/client/**/*.jade";
  gulp.watch(jadeFiles, function(){
    gulp.src(jadeFiles)
    .pipe(plugin.jade({
        pretty:true
    }))
    .pipe(gulp.dest("src/client/"));
  });
})

gulp.task('less', function () {
  var lessFile = "src/client/**/style.less";
  gulp.watch(lessFile, function(){
    gulp.src(lessFile)
    .pipe(plugin.less())
    .pipe(plugin.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(gulp.dest("src/client/"));
  });
})

function watchServer(params) {
   gulp.watch(srcServer, ['compile-server']);
}

function compileServer(params) {
   var tsServerProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   module: 'commonjs',
   target: 'ES5'
   });
      
   var tsResult = gulp.src(srcServer)     
      .pipe(ts(tsServerProject));

   return tsResult.js
      .pipe(gulp.dest('src/server/'));

}

var srcClient = ['src/client/**/*.ts'];
gulp.task('watch-client', ['compile-client'], watchClient);
gulp.task('compile-client', compileClient);


function watchClient(params) {
   gulp.watch(srcClient, ['compile-client']);
}

function compileClient(params) {
   var tsClientProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   module: 'amd',
   target: 'ES5'
   });
      
   var tsResult = gulp.src(srcClient)     
      .pipe(ts(tsClientProject));

   return tsResult.js
      .pipe(gulp.dest('src/client/'));
}


