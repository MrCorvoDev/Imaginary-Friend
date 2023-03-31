//=======================================================================================================================================================================================================================================================
import {debounce} from "./lodash.js";
import _dom from "./dom.js";
import _number from "./number.js";
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействия с header
 * @namespace
 * @property {Element} self {@link _header.self} Тег header
 * @property {Element} menu {@link _header.menu} Элемент меню
 * @property {boolean} stk {@link _header.stk} Происходит ли расчет sticky при прокрутке
 * @property {number} h {@link _header.h} Высота шапки
 * @property {number} sh {@link _header.sh} Высота шапки в форме sticky
 */
const _header = {};
/**
 * Тег header
 * @type {Element}
 */
_header.self = _dom.get.one("header", 2);
/**
 * Элемент меню
 * @type {Element}
 */
_header.menu = _header.self.firstElementChild.lastElementChild;
/**
 * Элемент меню body
 * @type {Element}
 */
_header.menuBD = _header.menu.lastElementChild;
/**
 * Происходит ли расчет sticky при прокрутке
 * @type {boolean}
 */
_header.stk = true;
/**
 * Объект с высотой header в форме sticky и обычной на PC и Mobile
 * @type {object};
 */
const HEIGHT_HEADER = {PC: 80, Mobile: 50, StickyPC: 50, StickyMobile: 30};
/**
 * Высота шапки
 * @type {number}
 */
_header.h = _number.dc(HEIGHT_HEADER.PC, HEIGHT_HEADER.Mobile);
/**
 * Высота шапки в форме sticky
 * @type {number}
 */
_header.sh = _number.dc(HEIGHT_HEADER.StickyPC, HEIGHT_HEADER.StickyMobile);
/** Установка высоты header как CSS Переменные */
const headerHeightSetCSSVariable = (function calc() {
   document.body.style.setProperty("--headerH", _header.h + "px");
   document.body.style.setProperty("--headerSH", _header.sh + "px");
   return calc;
})();
debounce("resize", 250, () => { // Обновление переменных _header.h, _header.sh при событии resize
   _header.h = _number.dc(HEIGHT_HEADER.PC, HEIGHT_HEADER.Mobile);
   _header.sh = _number.dc(HEIGHT_HEADER.StickyPC, HEIGHT_HEADER.StickyMobile);
   headerHeightSetCSSVariable();
});
//=======================================================================================================================================================================================================================================================
export default _header;
//=======================================================================================================================================================================================================================================================