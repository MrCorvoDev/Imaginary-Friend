//=======================================================================================================================================================================================================================================================
import debounceFunction from "lodash/debounce.js";
import throttleFunction from "lodash/throttle.js";
//=======================================================================================================================================================================================================================================================
/**
 * Создает обработчик `debounceFunction` событий. Подробнее про {@link debounceFunction}
 * @param {string} eventType Тип События
 * @param {number} wait Задержка в миллисекундах
 * @param {Function} func Функция
 * @param {(object|boolean)} options Объект параметров. Если установлен true тогда object = {leading: true, trailing: false}
 * @param {boolean|number} [options.leading=false] Запускать ли `func` в начале `wait`.
 * @param {number} [options.maxWait] Максимальное время функции до того как будет вызвана.
 * @param {boolean|number} [options.trailing=true]  Запускать ли `func` в конце `wait`.
 * @param {Element} element Элемент на кого вешать событие
 * @returns {Function} debounced Функция
 */
export function debounce(eventType, wait, func, options = {}, element) {
   if (typeof options !== "object" && options) options = {leading: true, trailing: false};

   const debounced = debounceFunction(func, wait, options);

   if (element) element.addEventListener(eventType, debounced);
   else addEventListener(eventType, debounced);

   return debounced;
}
//=======================================================================================================================================================================================================================================================
/**
 * Создает обработчик `throttleFunction` событий. Подробнее про {@link throttleFunction}
 * @param {string} eventType Тип События
 * @param {number} wait Задержка в миллисекундах
 * @param {Function} func Функция
 * @param {(object|boolean)} options Объект параметров.
 * @param {boolean|number} [options.leading=false] Запускать ли `func` в начале `wait`.
 * @param {boolean|number} [options.trailing=true] Запускать ли `func` в конце `wait`.
 * @param {Element} element Элемент на кого вешать событие
 * @returns {Function} throttled Функция
 */
export function throttle(eventType, wait, func, options = {}, element) {
   const throttled = throttleFunction(func, wait, options);

   if (element) element.addEventListener(eventType, throttled);
   else addEventListener(eventType, throttled);

   return throttled;
}
//=======================================================================================================================================================================================================================================================
export {debounceFunction, throttleFunction};
//=======================================================================================================================================================================================================================================================