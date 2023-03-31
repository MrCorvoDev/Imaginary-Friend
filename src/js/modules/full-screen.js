//=======================================================================================================================================================================================================================================================
/**
 * * Устанавливает высоту блокам относительно высоты экрана(VH)
 * Скрипт создает CSS переменную с высотой и именем указанным в [data-vh="NAME"]
 * Группа по-умолчанию: vh (Ровняется 100vh (Если шапка фиксированная тогда 100vh - {@link _header.sh}))
 * `Вычитаемая высота` Принимающие значения(можно совмещать знаком "&"):
 * ---> "px: `значение в пикселях`": Будет преобразовано в rem
 * ---> "headerH": Ровняется {@link _header.h}
 * ---> "headerSH": Ровняется {@link _header.sh}
 * ---> "`css selector`": Получает высоту элемента
 * HTML Структура:
 * ---> По Умолчанию: .js_e-vh
 * ---> Доп. Настройки: .js_e-vh[data-vh="NAME,VH,MINUS_HEIGHT"]
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../exports/lodash.js";
import _header from "../exports/header.js";
import _number from "../exports/number.js";
import _dom from "../exports/dom.js";
//=======================================================================================================================================================================================================================================================
const selectorsObj = {};
// Установка CSS переменной для обычных элементов с 100vh
if (_dom.el.has("lp", _header.self, 1)) fullScreenSet(null, "headerSH"); // Если у header есть пространство тогда CSS переменная должна учитывать его
else fullScreenSet(); // Установка CSS переменной без учета пространство header

/**
 * Создание CSS переменной
 * @param {string} [variable] Имя группы
 * @param {string|undefined} [selectors] Селекторы отнимаемой высоты
 * @param {number} [dataVh=100] Высота[100]
 */
function fullScreenSet(variable, selectors, dataVh = 100) {
   const set = (function fn() {
      const x = selectors ? getXHeight(selectors) : 0;
      const value = Math.max(_number.round(((dataVh * innerHeight) / 100) - x), 0);
      document.body.style.setProperty(`--vh${variable ? "-" + variable : ""}`, `${value}px`);
      return fn;
   }());
   debounce("resize", 500, set); // Перерасчет при событии resize
}
/**
 * Получить высоту селекторов
 * @param {string} selectorsString Строка с селекторами
 * @returns {number} Высота Селекторов
 */
function getXHeight(selectorsString) {
   let value = 0; // Возвращаемое высота селекторов
   const selectors = selectorsString.split("&"); // Получения объекта с селекторами

   for (const item of selectors) { // Получение высоты и прибавка к значению
      const selector = item.trim();

      if (selector.indexOf("px:") !== -1) { // Получение пикселей которые будут переведены в REM
         value += _number.keepRem(+selector.match(/\d+/)[0]); // Получение числа
      } else if (selector.indexOf("headerH") !== -1) { // Высота header
         value += _header.h;
      } else if (selector.indexOf("headerSH") !== -1) { // Высота header в форме sticky
         value += _header.sh;
      } else {
         selectorsObj[selector] ||= _dom.get.one(selector, 4);
         value += selectorsObj[selector].offsetHeight; // Высота элемента
      }
   }
   return value;
}
const groups = []; // Уникальные группы настроек
const vhElements = _dom.get.all("vh", 2); // Элементы с настройками
for (let i = 0; i < vhElements.length; i++) {
   const element = vhElements[i];
   const attribute = _dom.el.attr.get("vh", element); // Получение настроек
   if (groups.indexOf(attribute.replace(/ /g, "")) === -1) { // Проверка на уникальность настройки
      groups.push(attribute.replace(/ /g, "")); // Добавление в массив

      const settings = attribute.split(","); // Получение объекта с настройками
      const group = settings[0].trim(); // Название группы без пробелов
      const dataVh = settings[1].trim(); // Часть высоты экрана
      const selectors = settings[2]?.trim(); // Селекторы отнимаемой высоты

      fullScreenSet(group, selectors, dataVh); // Установка переменных для элементов с настройками
   }
}
//=======================================================================================================================================================================================================================================================