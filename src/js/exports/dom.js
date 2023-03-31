//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействие с Document Object Model
 * @namespace
 * @property {Function} get {@link _dom.get} Получить что-то из DOM
 * @property {Function} get.one {@link _dom.get.one} Получить элемент
 * @property {Function} get.all {@link _dom.get.all} Получить элементы
 * @property {Function} el {@link _dom.el} Взаимодействия с элементом DOM
 * @property {Function} el.has {@link _dom.el.has} Проверить существование статуса
 * @property {Function} el.add {@link _dom.el.add} Добавить статус
 * @property {Function} el.del {@link _dom.el.del} Удалить статус
 * @property {Function} el.tgl {@link _dom.el.tgl} Переключить статус
 * @property {Function} el.attr {@link _dom.el.attr} Взаимодействия с атрибутом элемента
 * @property {Function} el.attr.set {@link _dom.el.attr.set} Установить значение атрибуту
 * @property {Function} el.attr.get {@link _dom.el.attr.get} Получить значение атрибута
 * @property {Function} el.offset {@link _dom.el.offset} Возвращать координаты сверху и слева
 * @property {Function} el.vsb {@link _dom.el.vsb} Взаимодействия c видимостью элемента
 * @property {Function} el.vsb.show {@link _dom.el.vsb.show} Показать элемент
 * @property {Function} el.vsb.hide {@link _dom.el.vsb.hide} Скрыть элемент
 * @property {Function} el.vsb.tgl {@link _dom.el.vsb.tgl} Скрыть/Показать элемент
 */
const _dom = {};
/**
 * Получить что-то из DOM
 * @namespace
 * @property {Function} one {@link _dom.get.one} Получить элемент
 * @property {Function} all {@link _dom.get.all} Получить элементы
 */
_dom.get = {};
/**
 * Возвращать элемент
 * @param {string} name Имя
 * @param {number} [type=1] Тип (1 = Class, 2 = ID, 3 = Data Attribute, 4 = Any Selector) [1]
 * @param {Element} [parent=document.body] Элемент в котором искать [document.body]
 * @returns {Element} Найденный элемент
 */
_dom.get.one = function (name, type = 1, parent = document.body) {
   if (type === 1) return parent.querySelector(getSelectorName(name));
   if (type === 2) return document.getElementById(getSelectorName(name, 1, 0));
   if (type === 3) return parent.querySelector(getSelectorName(name, 4, 3));
   if (type === 4) return parent.querySelector(name);
};
/**
 * Возвращать элементы
 * @param {string} name Имя
 * @param {number} [type=1] Тип (1 = Class, 2 = Data Attribute, 3 = Any Selector, 4 = Tag Name) [1]
 * @param {Element} [parent=document.body] Элемент в котором искать [document.body]
 * @returns {(HTMLCollection|NodeList)} Найденные элементы
 */
_dom.get.all = function (name, type = 1, parent = document.body) {
   if (type === 1) return parent.getElementsByClassName(getSelectorName(name, 1, 0));
   if (type === 2) return parent.querySelectorAll(getSelectorName(name, 4, 3));
   if (type === 3) return parent.querySelectorAll(name);
   if (type === 4) return parent.getElementsByTagName(name);
};
/**
 * Взаимодействия с элементом DOM
 * @namespace
 * @property {Function} has {@link _dom.el.has} Проверить существование статуса
 * @property {Function} add {@link _dom.el.add} Добавить статус
 * @property {Function} del {@link _dom.el.del} Удалить статус
 * @property {Function} tgl {@link _dom.el.tgl} Переключить статус
 * @property {Function} attr {@link _dom.el.attr} Взаимодействия с атрибутом элемента
 * @property {Function} attr.set {@link _dom.el.attr.set} Установить значение атрибуту
 * @property {Function} attr.get {@link _dom.el.attr.get} Получить значение атрибута
 * @property {Function} offset {@link _dom.el.offset} Возвращать координаты сверху и слева
 * @property {Function} vsb {@link _dom.el.vsb} Взаимодействия c видимостью элемента
 * @property {Function} vsb.show {@link _dom.el.vsb.show} Показать элемент
 * @property {Function} vsb.hide {@link _dom.el.vsb.hide} Скрыть элемент
 * @property {Function} vsb.tgl {@link _dom.el.vsb.tgl} Скрыть/Показать элемент
 */
_dom.el = {};
/**
 * Проверить есть ли селектор у элемента
 * @param {string} name Имя
 * @param {Element} [element=document.body] Элемент [document.body]
 * @param {number} [type=2] Тип (1 = Element, 2 = Status, 3 = Option, 4 = Data Attribute) [2]
 * @returns {boolean} Есть или нет
 */
_dom.el.has = function (name, element = document.body, type = 2) {
   const selector = getSelectorName(name, type, 0);
   return (type !== 4) ? element.classList.contains(selector) : element.hasAttribute(selector);
};
/**
 * Добавить статус элементу
 * @param {string} name Имя
 * @param {Element} [element=document.body] Элемент [document.body]
 */
_dom.el.add = (name, element = document.body) => element.classList.add(`js_s-${name}`);
/**
 * Удалить статус у элемента
 * @param {string} name Имя
 * @param {Element} [element=document.body] Элемент [document.body]
 */
_dom.el.del = (name, element = document.body) => element.classList.remove(`js_s-${name}`);
/**
 * Переключить статус элементу
 * @param {string} name Имя
 * @param {Element} [element=document.body] Элемент [document.body]
 * @returns {boolean} Есть ли статус после выполнения
 */
_dom.el.tgl = (name, element = document.body) => element.classList.toggle(`js_s-${name}`);
/**
 * Взаимодействия с атрибутом элемента
 * @namespace
 * @property {Function} set {@link _dom.el.attr.set} Установить значение атрибуту
 * @property {Function} get {@link _dom.el.attr.get} Получить значение атрибута
 */
_dom.el.attr = {};
/**
 * Установить значение атрибуту
 * @param {string} name Имя
 * @param {string} value Значение
 * @param {Element} [element=document.body] Элемент [document.body]
 */
_dom.el.attr.set = (name, value, element = document.body) => element.setAttribute(getSelectorName(name, 4, 0), value);
/**
 * Получить значение атрибута
 * @param {string} name Имя
 * @param {Element} [element=document.body] Элемент [document.body]
 * @returns {string} Значение
 */
_dom.el.attr.get = (name, element = document.body) => element.getAttribute(getSelectorName(name, 4, 0));
/**
 * Возвращать координаты элемента сверху и слева(от начало страницы)
 * @param {Element} element Элемент
 * @param {Element} scrollElement Элемент с прокруткой
 * @returns {object} Координаты элемента
 */
_dom.el.offset = function (element, scrollElement) {
   const rect = element.getBoundingClientRect();

   return {
      top: (rect.y + (scrollElement ? scrollElement.scrollTop : scrollY)),
      left: (rect.x + (scrollElement ? scrollElement.scrollLeft : scrollX)),
   };
};
/**
 * Взаимодействия c видимостью элемента
 * @namespace
 * @property {Function} show {@link _dom.el.vsb.show} Показать элемент
 * @property {Function} hide {@link _dom.el.vsb.hide} Скрыть элемент
 * @property {Function} tgl {@link _dom.el.vsb.tgl} Скрыть/Показать элемент
 */
_dom.el.vsb = {};
/**
 * Показать элемент
 * @param {Element} element Элемент
 * @param {string} [value=""] Значение свойства display(Значение по умолчанию убирает значение в [style])[""]
 */
_dom.el.vsb.show = (element, value = "") => element.style.display = value;
/**
 * Скрыть элемент
 * @param {Element} element Элемент
 */
_dom.el.vsb.hide = element => element.style.display = "none";
/**
 * Переключить видимость элемента
 * @param {Element} element Элемент
 * @param {boolean} [condition=!element.offsetParent] Условие для показа элемента [проверка скрыт ли]
 * @param {string} [showValue=""] Значение свойства display (если будет показан)[""]
 */
_dom.el.vsb.tgl = (element, condition = !element.offsetParent, showValue = "") => (condition) ? _dom.el.vsb.show(element, showValue) : _dom.el.vsb.hide(element);
//=======================================================================================================================================================================================================================================================
/**
 * Вернуть селектор
 * @param {string} name Имя
 * @param {number} [type=1] Тип (1 = Element, 2 = Status, 3 = Option, 4 = Data Attribute) [1]
 * @param {number} [symbolIndex=1] Вернуть с (0 = "", 1 = ".", 2 = "#", 3 = "[]") [1]
 * @returns {string} Селектор
 */
function getSelectorName(name, type = 1, symbolIndex = 1) {
   const symbols = ["", ".", "#"];
   if (type === 1) return `${symbols[symbolIndex]}js_e-${name}`;
   if (type === 2) return `${symbols[symbolIndex]}js_s-${name}`;
   if (type === 3) return `${symbols[symbolIndex]}js_o-${name}`;
   if (type === 4) return (symbolIndex === 0) ? `data-${name}` : `[data-${name}]`;
}
//=======================================================================================================================================================================================================================================================
export default _dom;
//=======================================================================================================================================================================================================================================================