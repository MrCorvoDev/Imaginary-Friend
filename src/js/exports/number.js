//=======================================================================================================================================================================================================================================================
import _handleCache from "./cache.js";
import _repeatString from "./repeat-string.js";
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействие с числами
 * @namespace
 * @property {Function} random {@link _number.random} Случайное число
 * @property {Function} round {@link _number.round} Округлять число
 * @property {Function} divide {@link _number.divide} Возвращать ближайшее делимое число
 * @property {Function} prc {@link _number.prc} Получает процент или часть
 * @property {Function} rem {@link _number.rem} Конвертирует px to rem
 * @property {Function} keepRem {@link _number.keepRem} "Сохранять REM"
 * @property {Function} dc {@link _number.dc} Динамический подсчет
 * @property {Function} convertRange {@link _number.convertRange} Конвертировать число из старого диапазона в новый диапазон
 */
const _number = {};
/**
 * Генерировать случайное число
 * @param {number} min Минимальное число
 * @param {number} max Максимальное число
 * @returns {number} Случайное число
 */
_number.random = (min, max) => Math.random() * (max - min) + min;
/**
 * Округлять число используя разные методы. Также сохранять десятичные
 * @param {number} number Исходное число
 * @param {number} [decimal=4] Количество десятичных которые должны быть сохранены [4]
 * @param {(number|boolean)} [method=0] Метод округления [0] (round - 0, floor - 1, ceil - 2 и больше)
 * @returns {number} Округленное число
 */
_number.round = function (number, decimal = 4, method = 0) {
   return _handleCache("numRnd", (number, decimal = 4, method = 0) => {
      const numberOfDecimal = "1" + _repeatString("0", decimal);
      const result = (!method) ? Math.round(number * numberOfDecimal)
         : (method === 1) ? Math.floor(number * numberOfDecimal)
            : Math.ceil(number * numberOfDecimal);
      return (result / numberOfDecimal);
   }, arguments);
};
/**
 * Возвращать большее делимое число
 * @param {number} number Число
 * @param {number} divider Делитель
 * @returns {number} Делимое число
 */
_number.divide = function (number, divider) {
   return _handleCache("numDvd", (number, divider) => number + (divider - (number % divider)) % divider, arguments);
};
/**
 * Получает процент или часть
 * @param {number} numOne Число
 * @param {number} [numTwo=16] Исходное число(100%) [16]
 * @param {boolean} [type] Если true будет возвращать число
 * @returns {number|string} Число или число с знаком процента
 */
_number.prc = function (numOne, numTwo = 16, type) {
   return _handleCache("numPrc", (numOne, numTwo = 16, type) => {
      let result = numOne / numTwo; // Часть
      if (!type) result = _number.round(result * 100) + "%"; // Процент
      return result;
   }, arguments);
};
/**
 * Конвертировать px to rem
 * @param {number} num PX
 * @returns {string} REM
 */
_number.rem = function (num) {
   return _handleCache("numRem", num => _number.prc(num, 16, 1) + "rem", arguments);
};
/**
 * Изменять PX в актуальное REM значение
 * @param {number} num PX
 * @returns {number} PX равен актуальному REM
 */
_number.keepRem = function (num) {
   return _handleCache("numKRm", num => {
      /**
       * Размер шрифта по умолчанию
       * @constant {number}
       */
      const fontSize = +getComputedStyle(document.body).getPropertyValue("font-size").match(/\d+/)[0];

      return num * _number.prc(fontSize, 16, 1);
   }, arguments);
};
/**
 * Динамический подсчет
 * @param  {number} PC Размер на ПК
 * @param  {number} Mobile Размер на Мобильном устройстве
 * @returns {number} Актуальный размер
 */
_number.dc = function (PC, Mobile) {
   [].push.call(arguments, innerWidth);
   return _handleCache("numDc", (PC, Mobile, windowWidth) => {
      const DESIGN_WIDTH = 1440; // number - Размер полотна
      return Math.ceil(_number.keepRem(Mobile) + _number.keepRem(PC - Mobile) * ((windowWidth - _number.keepRem(320)) / _number.keepRem(DESIGN_WIDTH - 320)));
   }, arguments);
};
/**
 * Конвертировать число из старого диапазона в новый диапазон
 * @param {number} number Число из старого диапазона
 * @param {number} oldMin Минимальное число старого диапазона
 * @param {number} oldMax Максимальное число старого диапазона
 * @param {number} newMin Минимальное число нового диапазона
 * @param {number} newMax Максимальное число нового диапазона
 * @returns {number} Число в новом диапазоне
 */
_number.convertRange = function (number, oldMin, oldMax, newMin, newMax) {
   return _handleCache("numCvR", (number, oldMin, oldMax, newMin, newMax) => (((number - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin, arguments);
};
//=======================================================================================================================================================================================================================================================
export default _number;
//=======================================================================================================================================================================================================================================================