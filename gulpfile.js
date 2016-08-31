'use strict';
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'); //本地安装gulp所用到的地方

//引入组件
var minifycss = require('gulp-minify-css'),//CSS压缩
    uglify    = require('gulp-uglify'),//js压缩
    concat    = require('gulp-concat'),// 合并文件
    rename    = require('gulp-rename'),//重命名
    clean     = require('gulp-clean'),//清空文件夹
    minhtml   = require('gulp-htmlmin'),//html压缩
    //jshint    = require('gulp-jshint'),//js代码规范性检查
    imagemin  = require('gulp-imagemin'),//图片压缩
    spritesmith=require('gulp.spritesmith'),//雪碧图
    livereload = require('gulp-livereload'),//自动刷新F5
    notify = require('gulp-notify'),//更动通知
    autoprefixer = require('gulp-autoprefixer'),//自动添加前缀
    del = require('del'),
    browserSync = require('browser-sync'),//服务器
    cache = require('gulp-cache'),//图片快取，只有更改过得图片会进行压缩
    compass      = require('gulp-compass'),//编译compass
    runSequence = require('run-sequence'),    //用于按顺序执行 gulp 任务的插件
    sass      = require('gulp-sass');//编译sass



var project = {
    src: 'app/',
    dist: 'dist/',
    sass: '_source/sass/',
    css:'css/',
    js: 'js/',
    img: 'img/',
    images: 'images/'
};




//定义一个sass任务（自定义任务名称）


//定义一个testLess任务（自定义任务名称）

//html
gulp.task('html', function() {
  return gulp.src(project.src +'**/*.{html,htm}')
    .pipe(gulp.dest(project.dist));
    //.pipe(browserSync.reload({
    //  stream: true
    //}));
    //.pipe(notify({ message: 'html task complete' }));
});

//js
gulp.task('js', function() {
  return gulp.src(project.src + project.js +'**/*.js')
    .pipe(gulp.dest( project.dist + project.js ))
    //.pipe(browserSync.reload({
    //  stream: true
    //}))
    //.pipe(rename({ suffix: '.min' }))//js，重命名
    //.pipe(uglify())//压缩js
    //.pipe(gulp.dest( project.dist + project.js ))
    //.pipe(livereload())
    .pipe(notify({ message: 'js task complete' }));
});

// css
gulp.task('css', function() {
  return gulp.src(project.src + project.sass +'**/*.{scss,sass}')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions','>1%','ie > 8','ff > 20','chrome > 34' ,'safari > 6'],
            cascade: false
        }))
    .pipe(gulp.dest(project.src + project.css))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(project.dist + project.css))
    //.pipe(browserSync.reload({
    //  stream: true
    //}))
    //.pipe(livereload())
    .pipe(notify({ message: 'css task complete' }));
});

//compass
gulp.task('compass', function() {
  return gulp.src(project.src + project.sass +'**/*.{scss,sass}')
    .pipe(compass({
      css: project.src + project.css,
      sass: project.src + project.sass,
      image: project.src + project.images
    }))
    .pipe(autoprefixer({
            browsers: ['last 2 versions','>1%','ie > 8','ff > 20','chrome > 34' ,'safari > 6'],
            cascade: false
        }))
    .pipe(gulp.dest(project.src + project.css))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(project.dist + project.css))
    //.pipe(browserSync.reload({
    //  stream: true
    //}))
    //.pipe(livereload())
    .pipe(notify({ message: 'compass task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(project.src + project.images+'**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(project.dist+ project.images));
    //.pipe(browserSync.reload({
    //  stream: true
    //}))
    //.pipe(livereload());
    //.pipe(notify({ message: 'Images task complete' }));
});

// Img
gulp.task('imgs', function() {
  return gulp.src(project.src + project.img+'**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(project.dist+ project.img));
    //.pipe(browserSync.reload({
    //  stream: true
    //}))
    //.pipe(livereload());
    //.pipe(notify({ message: 'Img task complete' }));
});


gulp.task('sprite2', function () {
    return gulp.src(project.src + project.img+'**/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite.png',//保存合并后图片的地址
            cssName: 'sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'binary-tree',//注释1
            cssTemplate:project.src + project.css+'sprite.css'//注释2
        }))
        .pipe(gulp.dest( project.dist + project.css));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(project.src + project.img+'icons/*.png')
                  .pipe(spritesmith({
                    imgName: project.img+'sprite.png',
                    cssName: project.css+'sprite.css',
                    padding:5,
                    algorithm: 'binary-tree'//注释1
                    //cssTemplate:project.src + project.css+'sprite.css'//注释2
                  }));
  return spriteData.pipe(gulp.dest( project.dist));
});






// Clean
gulp.task('clean', function(cb) {
   return  del(['dist','.sass-cache',project.src + project.css+'**/*.css'], cb);
   
});


// Watch
gulp.task('watch', function() {

  gulp.watch(project.src +'*.{html,htm}', ['html']);

  gulp.watch(project.src + project.sass +'*.{scss,sass}', ['css']);

  //gulp.watch(project.src + project.sass +'*.{scss,sass}', ['compass']);
 
  gulp.watch(project.src + project.js +'**/*.js', ['js']);
 
  gulp.watch(project.src + project.images+'**/*', ['images']);

  //gulp.watch(project.src + project.img+'**/*', ['imgs']);
 
  //livereload.listen();
 
  //gulp.watch([project.dist+'**']).on('change', livereload.changed);
 
});




//Server


gulp.task('browsersync', function() {
     browserSync({
        notify: false,
        port: 8888,
        server: {
            baseDir: ['app'],
            index: '城市经理OA首页.htm',
            routes: {
                // '/bower_components': 'bower_components'
            }
        }
    });
});





//Build
gulp.task('compass-build',function (callback){

  runSequence('clean',['html','compass', 'js', 'images', 'imgs'],callback)

});

//
gulp.task('css-build', function (callback) {

  runSequence('clean', ['html','css', 'js', 'images'],callback)

});



// Default task
gulp.task('default',function (callback){

  runSequence('clean', ['html','css', 'js', 'images'],'watch',callback)

});//定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径