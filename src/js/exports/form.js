//=======================================================================================================================================================================================================================================================
import _dom from "./dom.js";
//=======================================================================================================================================================================================================================================================
const isFeat = {
   errorToParent: true,
   focusToParent: true,
};
/**
 * Взаимодействия с формой
 * @namespace
 * @property {Function} err {@link _form.err} Функции err
 * @property {Function} foc {@link _form.foc} Функции foc
 */
const _form = {};
/**
 * Упрвлять статусом ошибки
 * @namespace
 * @property {Function} add {@link _form.err.add} Добавить ошибку
 * @property {Function} remove {@link _form.err.remove} Удалить ошибку
 */
_form.err = {};
/**
 * Добавить ошибку
 * Добавляет .js_s-invalid
 * Если есть [data-invalid] тогда добавляется элемент .js_e-invalid-txt
 * @param {Element} input Элемент формы
 */
_form.err.add = function (input) {
   _dom.el.add("invalid", input);
   if (isFeat.errorToParent) _dom.el.add("invalid", input.parentElement);

   const inputErrorText = _dom.el.attr.get("invalid", input);
   if (!inputErrorText) return;

   const hasInputError = _dom.el.has("invalid-el", input);
   if (hasInputError) return;

   input.parentElement.insertAdjacentHTML("beforeend", "<div class='js_e-invalid-txt'>" + inputErrorText + "</div>"); // Добавить текст ошибки
   _dom.el.add("invalid-el", input);
};
/**
 * Удалить ошибку
 * Удаляет .js_s-invalid
 * Если есть [data-invalid] тогда удаляется элемент .js_e-invalid-txt
 * @param {Element} input Элемент формы
 */
_form.err.remove = function (input) {
   _dom.el.del("invalid", input);
   if (isFeat.errorToParent) _dom.el.del("invalid", input.parentElement);

   const inputErrorText = _dom.el.attr.get("invalid", input);
   if (!inputErrorText) return;

   if (!_dom.el.has("invalid-el", input)) return;

   const inputError = input.parentElement.lastElementChild;
   if (!inputError) return;

   input.parentElement.removeChild(inputError); // Удалить текст ошибки
   _dom.el.del("invalid-el", input);
};
/**
 * Управлять статусом фокуса
 * @namespace
 * @property {Function} add {@link _form.foc.add} Добавить фокус
 * @property {Function} remove {@link _form.foc.remove} Удалить фокус
 */
_form.foc = {};
/**
 * Добавить фокус
 * Добавляет .js_s-focus
 * @param {Element} input Элемент формы
 */
_form.foc.add = function (input) {
   _dom.el.add("focus", input);
   if (isFeat.focusToParent) _dom.el.add("focus", input.parentElement);
};
/**
 * Удалить фокус
 * Удаляет .js_s-focus
 * @param {Element} input Элемент формы
 */
_form.foc.remove = function (input) {
   _dom.el.del("focus", input);
   if (isFeat.focusToParent) _dom.el.del("focus", input.parentElement);
};
//=======================================================================================================================================================================================================================================================
export default _form;
//=======================================================================================================================================================================================================================================================