//=======================================================================================================================================================================================================================================================
import _handleCache from "./cache.js";
import _dom from "./dom.js";
import _header from "./header.js";
//=======================================================================================================================================================================================================================================================
const debug = false && process.env.NODE_ENV === "development";
/**
 * Проверять что-то
 * @namespace
 * @property {Function} local {@link _is.local} Проверить "локальная" ли ссылка
 * @property {Function} hide {@link _is.hide} Проверять что родитель элемента скрыт
 * @property {Function} range {@link _is.range} Проверять входит ли число в диапазон
 * @property {Function} seen {@link _is.seen} Проверять виден ли элемент в viewport
 */
const _is = {};
/**
 * Проверять что ссылка ведет на эту же страницу
 * @param {(Element|string)} link Ссылка
 * @returns {boolean} Локальная ли ссылка
 */
_is.local = function (link) {
   return _handleCache("isLoc", link => {
      if (typeof link === "string") link = new URL(link, location.origin);
      return location.pathname.replace(/^\//, "") === link.pathname.replace(/^\//, "") && location.hostname === link.hostname;
   }, arguments);
};
/**
 * Проверять что родитель элемента скрыт
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent}
 * @param {Element} element Элемент
 * @returns {boolean} Скрыт или нет
 */
_is.hide = element => !element.offsetParent;
/**
 * Проверять входит ли число в заданный диапазон от другого числа
 * @param {number} number Число
 * @param {number} sourceNumber Исходное число
 * @param {number} [range=5] Диапазон [5]
 * @returns {boolean} Входит ли число в диапазон
 */
_is.range = function (number, sourceNumber, range = 5) {
   return _handleCache("isRng", (number, sourceNumber, range = 5) => number + range >= sourceNumber && number - range <= sourceNumber, arguments);
};
/**
 * Проверять виден ли элемент в viewport
 * @param {Element} element Элемент
 * @param {number} percent Процент который должен быть виден
 * @returns {boolean} Виден или нет
 */
_is.seen = function (element, percent) {
   const headerHeight = !_dom.el.has("lp", _header.self, 1) ? 0 : _dom.el.has("sticky") ? _header.sh : _header.h;
   const elementTop = element.getBoundingClientRect().y;
   const elementBottom = element.getBoundingClientRect().bottom;
   const elementHeight = percent ? ((element.offsetHeight * percent) / 100) : 0;
   const result = ((innerHeight - (elementTop + elementHeight)) > 0) && (elementBottom > (headerHeight + elementHeight));

   if (debug) console.log("vh = ", innerHeight);
   if (debug) console.log("elementTop = ", elementTop);
   if (debug) console.log("elementBottom = ", elementBottom);
   if (debug) console.log("headerHeight = ", headerHeight);
   if (debug) console.log("elementHeight = ", elementHeight);
   if (debug) console.log("result = ", result);

   return result;
};
/** Является ли это touch устройством */
_is.touch = undefined;
//=======================================================================================================================================================================================================================================================
export default _is;
//=======================================================================================================================================================================================================================================================