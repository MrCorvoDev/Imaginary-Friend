//=======================================================================================================================================================================================================================================================
import webp from "gulp-webp";
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from "gulp-imagemin";
import sharp from "sharp";
import through2 from "through2";
import gulp from "gulp";
import path from "../config/path.js";
import {ifProd, isDev} from "../exports/mode.js";
import {notifyError} from "../exports/notifyError.js";
import browserSync from "browser-sync";
import newer from "gulp-newer";
import fs from "fs";
import nodeStream, {Stream} from "stream";
import gulpPath from "path";
import merge from "merge2";
//=======================================================================================================================================================================================================================================================
/** Компилировать изображения */
const compileImages = () => {
   if (!fs.existsSync(path.distF)) fs.mkdirSync(path.distF); // Если dist папки нет - создать
   if (!fs.existsSync(path.dist.img)) fs.mkdirSync(path.dist.img); // Если img папки нет - создать

   /** Сжать фотки */
   const minify = () => imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75}),
      optipng({optimizationLevel: 5}),
      svgo({name: "preset-default"})
   ]);
   /**
    * Асинхронно добавить суффикс ширины
    * @param {number} width Ширина
    * @param {number} i Индекс массива с шириной
    * @returns {Stream} Stream
    */
   const asyncAddWidthSuffix = (width, i) => {
      const stream = new nodeStream.Transform({objectMode: true});
      /**
       * Разбор пути
       * @param {string} path Разбор пути
       * @returns {object} Объект с путями
       */
      const parsePath = path => {
         const extname = gulpPath.extname(path);
         return {
            dirname: gulpPath.dirname(path),
            basename: gulpPath.basename(path, extname),
            extname: extname
         };
      };
      stream._transform = async function (originalFile, unused, callback) {
         const file = originalFile.clone({contents: false});
         const parsedPath = parsePath(file.relative);

         const image = sharp(file.contents);
         const metadata = await image.metadata();
         const suffix = (metadata.width >= width && i !== 0) ? `-${width}` : "";

         file.path = gulpPath.join(file.base, gulpPath.join(parsedPath.dirname, parsedPath.basename + suffix + parsedPath.extname));
         callback(null, file);
      };

      return stream;
   };
   /**
    * Изменить размер изображения
    * @param {number} width Ширина
    */
   const resizeImages = width => through2.obj(async function (file, _, cb) {
      const image = sharp(file.contents);
      const metadata = await image.metadata();

      if (metadata.width >= width) image.resize(width).toBuffer().then(buffer => {
         file.contents = buffer;
         cb(null, file);
      });
      else cb(null, file);
   });


   const streams = [];

   if (isDev) {
      streams.push(gulp.src([`${path.src.img}{jpg,jpeg,png,gif}`, `!${path.src.ico}`]) // Простое копирование для DEV Mode
         .pipe(notifyError("IMAGES"))
         .pipe(newer(path.dist.img)));
   } else {
      /** Массив с разрешениями(нулевое - максимальное разрешенное разрешение) */
      const widthArray = [2560, 1920, 960];

      for (let i = 0; i < widthArray.length; i++) { // Компиляция отзывчивых фото
         const width = widthArray[i];

         streams.push(gulp.src([`${path.src.img}{jpg,jpeg,png,gif}`, `!${path.src.ico}`])
            .pipe(notifyError("RESPONSIVE IMAGES"))
            .pipe(asyncAddWidthSuffix(width, i))
            .pipe(newer({dest: path.dist.img, ext: "webp"}))
            .pipe(resizeImages(width))
            .pipe(webp()));

         streams.push(gulp.src([`${path.src.img}{jpg,jpeg,png,gif}`, `!${path.src.ico}`])
            .pipe(notifyError("RESPONSIVE WEBP IMAGES"))
            .pipe(asyncAddWidthSuffix(width, i))
            .pipe(newer(path.dist.img))
            .pipe(resizeImages(width))
            .pipe(minify()));
      }
   }

   streams.push(gulp.src([`${path.src.img}svg`, `!${path.src.ico}`]) // Компиляция SVG
      .pipe(notifyError("SVG IMAGES"))
      .pipe(newer(path.dist.img))
      .pipe(ifProd(minify())));

   return merge(streams)
      .pipe(gulp.dest(path.dist.img))
      .pipe(browserSync.stream());
};
//=======================================================================================================================================================================================================================================================
export default compileImages;
//=======================================================================================================================================================================================================================================================