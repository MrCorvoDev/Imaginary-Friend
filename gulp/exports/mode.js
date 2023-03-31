//=======================================================================================================================================================================================================================================================
import gulpIf from "gulp-if";
//=======================================================================================================================================================================================================================================================
/**
 * Включен ли режим разработки
 * @type {boolean}
 */
export const isDev = !process.argv.includes("--build");
/**
 * Выполнять при режиме разработки
 * @param {Function} fn Функция для выполнения при условии
 * @param {Function} elseFn Функция для выполнения если условие - false
 */
export const ifDev = (fn, elseFn) => gulpIf(isDev, fn, elseFn);
/**
 * Выполнять при режиме производства
 * @param {Function} fn Функция для выполнения при условии
 * @param {Function} elseFn Функция для выполнения если условие - false
 */
export const ifProd = (fn, elseFn) => gulpIf(!isDev, fn, elseFn);
//=======================================================================================================================================================================================================================================================