const gulp = require('gulp');
const ts = require('gulp-typescript');
const runSequnce = require('run-sequence');
const atomElectron = require('gulp-atom-electron');
const symdest = require('gulp-symdest');
const electronConnect = require('electron-connect').server.create({ stopOnClose: true });
const rimraf = require('rimraf');
const electron = require('gulp-atom-electron');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', ['clean', 'copy', 'transpile']);

gulp.task('clean', () => {
  rimraf.sync('./dist');
})

gulp.task('serve', () => {
  process.env.NODE_ENV = 'development';
  runSequnce('build', 'electron-start', 'watch');
});

gulp.task('watch', () => {
  gulp.watch(['./src/*.html', './src/*.css'], () => {
    runSequnce('copy', 'electron-reload');
  });
  // Changes to the file creating the electron window require a full restart
  gulp.watch(['src/main.ts'], () => {
    runSequnce('transpile', 'electron-restart');
  });
  // watches all .ts files except for main.ts
  gulp.watch(['src/**/!(main).ts'], () => {
    runSequnce('transpile', 'electron-reload');
  });
})

// Copies everything "static" to the destination folder
gulp.task('copy', () => {
  gulp.src(['./src/**/*', '!./src/**/*.ts']).pipe(gulp.dest('dist'));
})

// Starts electron, callback is needed so we can shutdown gulp when we're done
gulp.task('electron-start', () => {
  electronConnect.start(callback);
});
gulp.task('electron-reload', electronConnect.reload);
gulp.task('electron-restart', electronConnect.restart);

gulp.task('transpile', () => {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
})

const callback = function (electronProcState) {
  if (electronProcState == 'stopped') {
    process.exit();
  }
};

gulp.task('electron-download', () => {
  return electron.dest('./electron-build', {
    version: '1.7.5',
    platform: 'win32'
  })
})

gulp.task('electron:build:osx', function () {
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.7.5',
            platform: 'win32'
        }))
        .pipe(symdest('packages/osx'));
});

// Obviously we want a nice executable for our application. So this task gracefully does the job for us.
gulp.task('package', function (done) {
    return runSequnce('build', 'electron-download', 'electron:build:osx', done);
});