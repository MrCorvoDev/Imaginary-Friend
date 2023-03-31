//=======================================================================================================================================================================================================================================================
import gulp from "gulp";
import path from "./gulp/config/path.js";
import nodePath from "path";
import {deleteSync} from "del";
//=======================================================================================================================================================================================================================================================
import createServer from "./gulp/tasks/server.js";
import createZIP from "./gulp/tasks/zip.js";
import uploadToServer from "./gulp/tasks/ftp.js";
import compileFiles from "./gulp/tasks/files.js";
import compileHTML from "./gulp/tasks/html.js";
import compileSCSS from "./gulp/tasks/scss.js";
import compileJS from "./gulp/tasks/js.js";
import compilePHP from "./gulp/tasks/php.js";
import compileImages from "./gulp/tasks/images.js";
import generateFavicon from "./gulp/tasks/favicon.js";
import {otfToTtf, ttfToWoff, generateFontStyles} from "./gulp/tasks/fonts.js";
import clearCompiledFiles from "./gulp/tasks/clean.js";
//=======================================================================================================================================================================================================================================================
/**
 * Слежка за файлами
 * @param {string} watchPath Путь для слежки
 * @param {Function} fn Задача
 * @param {string} srcPath Путь к файлам от src
 * @param {string} distPath Путь к файлам от dist
 * @param {string} ext Расширение dist файлов
 */
const watch = (watchPath, fn, srcPath = "", distPath = "", ext = "") => {
   gulp.watch(watchPath, fn).on("unlink", filepath => {
      const obj = nodePath.parse(filepath);
      filepath = nodePath.resolve(obj.root, obj.dir, obj.name + (ext || obj.ext));

      const srcFilePath = nodePath.relative(nodePath.resolve(path.srcF, srcPath), filepath);
      const destFilePath = nodePath.resolve(path.distF, distPath, srcFilePath);
      deleteSync(destFilePath);
   });
};
/** Наблюдать */
function watcher() {
   watch(path.watch.files, compileFiles, "files");
   watch(path.watch.html, compileHTML, "html");
   watch(path.watch.scss, compileSCSS, "scss", "css", ".css");
   watch(path.watch.js, compileJS);
   watch(path.watch.php, compilePHP);
   watch(path.watch.img, compileImages);
}
//=======================================================================================================================================================================================================================================================
/** Компилировать шрифты */
const compileFonts = gulp.series(otfToTtf, ttfToWoff, generateFontStyles);
/** Основные задачи(Компилировать) */
const mainTasks = gulp.parallel(compileFiles, compileHTML, compileSCSS, compileJS, compilePHP, compileImages);
/** Одноразовые задачи */
const oneTimeTasks = gulp.parallel(generateFavicon, compileFonts);
//=======================================================================================================================================================================================================================================================
/** Продолжать разработку */
const devMode = gulp.parallel(watcher, createServer);
/** Продолжать разработку после компиляции */
const devInitMode = gulp.series(mainTasks, devMode);
/** Инициализировать разработку (Компилировать все что требуется для разработки) */
const initDevelopment = gulp.series(gulp.parallel(compileFiles, gulp.series(generateFavicon, compileHTML), gulp.series(compileFonts, compileSCSS), compileJS, compilePHP, compileImages), devMode);
/** Полностью компилировать в режиме производство */
const buildInitMode = gulp.parallel(compileFiles, gulp.series(generateFavicon, compileHTML), gulp.series(compileFonts, compileSCSS), compileJS, compilePHP, compileImages);
/** Запустить сервер для производства */
const buildServerMode = gulp.parallel(watcher, createServer);
//=======================================================================================================================================================================================================================================================
export {devMode, devInitMode, initDevelopment, mainTasks, buildInitMode, buildServerMode, createZIP, uploadToServer, clearCompiledFiles, oneTimeTasks};
//=======================================================================================================================================================================================================================================================