//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал tags input
 * HTML Структура: .js_e-tags-input>ul(>li.tags-input__input>input)+button+textarea
 * li.tags-input__input Должен быть в конце
 * Чтобы добавить тег по умолчанию нужно добавить в начало ul это li>span+button и добавить его в textarea как lowercase
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../../../exports/dom.js";
import {debounce} from "../../../exports/lodash.js";
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействие с тегами
 * @namespace
 * @property {Function} create {@link _tag.create} Создать элемент тег
 * @property {Function} removeFromString {@link _tag.removeFromString} Удалить тег из строки с тегами
 * @property {Function} isExist {@link _tag.isExist} Проверить если ли такой тег
 * @property {Function} getIndex {@link _tag.getIndex} Получить индекс тега и массив тегов
 * @property {Function} add {@link _tag.add} Добавить тег
 * @property {Function} remove {@link _tag.remove} Удалить тег
 */
const _tag = {
   /**
    * Создать элемент тег
    * @param {string} content Имя тега
    * @returns {Element} Элемент Тега
    */
   create: content => Object.assign(document.createElement("li"), {
      innerHTML: `<span>${content}</span><button type='button'></button>`
   }),
   /**
    * Удалить тег из строки с тегами
    * @param {string} tags Строка с тегами
    * @param {string} tag Тег
    * @returns {string} Новая строка без тега
    */
   removeFromString: function (tags, tag) {
      const {index, tagsArray} = this.getIndex(tags, tag);

      tagsArray.splice(index, 1); // Удалить элемент

      return tagsArray.join(", ");
   },
   /**
    * Проверить если ли такой тег
    * @param {string} tags Строка с тегами
    * @param {string} tag Тег
    * @returns {boolean} Есть или нет
    */
   isExist: function (tags, tag) {
      const {index} = this.getIndex(tags, tag);

      return index === -1 ? false : true;
   },
   /**
    * Получить индекс тега и массив тегов
    * @param {string} tags Строка с тегами
    * @param {string} tag Тег
    * @returns {{number, array}} Индекс найденного тега и массив с тегами
    */
   getIndex: function (tags, tag) {
      const tagsArray = tags.split(", ");
      const index = tagsArray.indexOf(tag.toLowerCase());

      return {index, tagsArray};
   },
   /**
    * Добавить тег
    * @param {Element} textarea Элемент со всеми тегами
    * @param {Element} input Поле ввода
    * @param {string} newTag Новый тег
    */
   add: function (textarea, input, newTag) {
      if (this.isExist(textarea.value, newTag.toLowerCase())) return;

      const newTagEl = this.create(newTag);

      textarea.value += (textarea.value ? ", " : "") + newTag.toLowerCase();
      input.parentElement.before(newTagEl);

      input.value = _dom.el.attr.get("placeholder", input);
   },
   /**
    * Удалить тег
    * @param {Element} li Элемент списка
    * @param {Element} textarea Элемент со всеми тегами
    */
   remove: function (li, textarea) {
      const value = li.firstElementChild.textContent.toLowerCase();
      li.remove();
      textarea.value = _tag.removeFromString(textarea.value, value);
   }
};
//=======================================================================================================================================================================================================================================================
debounce("click", 250, function ({target: button}) { // Добавить тег
   const mainEl = button.parentElement;

   if (button.tagName !== "BUTTON") return;
   if (!_dom.el.has("tags-input", mainEl, 1)) return;

   const textarea = mainEl.lastElementChild;
   const input = mainEl.firstElementChild.lastElementChild.firstElementChild;
   const newTag = input.value;

   if (newTag === _dom.el.attr.get("placeholder", input)) return;

   _tag.add(textarea, input, newTag);
}, true);
debounce("click", 250, function ({target: button}) { // Удалить тег
   const li = button.parentElement;
   const mainEl = li.parentElement.parentElement;

   if (button.tagName !== "BUTTON") return;
   if (li.tagName !== "LI") return;
   if (!_dom.el.has("tags-input", mainEl, 1)) return;

   const textarea = mainEl.lastElementChild;

   _tag.remove(li, textarea);
}, true);
//=======================================================================================================================================================================================================================================================