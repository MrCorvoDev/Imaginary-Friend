//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал drop-down
 * Поддерживает клавиатуру
 * Поддерживает умную позицию
 * При анимации открытия добавляется .js_s-slide к `menu`
 * При открытии добавляется .js_s-act-dd и [data-dd] с номером уровня к `drop-down`
 * HTML Структура: li.js_e-dd>(TITLE>LINK+BUTTON)+ul
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../../exports/lodash.js";
import _is from "../../exports/is.js";
import _dom from "../../exports/dom.js";
import _slide from "../../exports/slide.js";
import _mediaQuery from "../../exports/media-query.js";
import _number from "../../exports/number.js";
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействие с меню
 * @namespace
 * @property {Function} last {@link dd.last} Последнее открытое меню
 * @property {Function} open {@link dd.open} Показывает меню
 * @property {Function} close {@link dd.close} Скрывает меню
 * @property {Function} toggle {@link dd.toggle} Toggle меню
 * @property {number} MARGIN {@link dd.MARGIN} Отступ от одного меню до другого
 * @property {number} PADDING {@link dd.PADDING} Внешний отступ от <li> до <ul>
 * @property {Function} getParentDropDown {@link dd.getParentDropDown} Получить родительский Drop-Down
 * @property {Function} closeAllToCurrent {@link dd.closeAllToCurrent} Закрывать меню до текущего (закрыть ненужные)
 */
const dd = {};
/**
 * Последнее открытое меню
 * @type {(Element|null)}
 */
dd.last = undefined;
/**
 * Показывает меню
 * @param {Element} menu Menu
 */
dd.open = function (menu) {
   if (!_is.hide(menu)) return;

   level.set(menu);
   _dom.el.vsb.show(menu, "block");

   if (status.isPosition) position.choose(menu); // Если определение позиции разрешено

   dd.last = menu; // Установить текущее меню как последнее

   if (!status.isClick) return; //* Все что ниже выполняется при клике на кнопку
   _slide.down(menu, 100); // Открыть слайдом
   _dom.el.add("act-dd", menu.parentElement);
};
/**
 * Скрывает меню
 * @param {Element} menu Menu
 */
dd.close = function (menu) {
   if (_is.hide(menu)) return;

   dd.last = (level.get(dd.last) === "1") ? null : menu.parentElement.closest("ul"); // Установка предыдущего меню

   if (!status.isClick) return _dom.el.vsb.hide(menu); // Просто скрыть //* Все что ниже выполняется при клике на кнопку
   _slide.up(menu, 100); // Скрыть слайдом
   _dom.el.del("act-dd", menu.parentElement);
};
/**
 * Показывает\Скрывает меню
 * @param {Element} menu Menu
 */
dd.toggle = menu => (_is.hide(menu)) ? dd.open(menu) : dd.close(menu);
/** Отступ от одного меню до другого. При изменении также изменить в scss */
dd.MARGIN = _number.keepRem(5);
/** Внешний отступ от <li> до <ul>. Также используется для компенсирования позиции при позиционировании слева или справа. При изменении также изменить в scss */
dd.PADDING = _number.keepRem(10);
/**
 * Получить родительский Drop-Down
 * @param {Element} dropDown Drop-Down
 * @returns {(Element|boolean)} Родительский Drop-Down
 */
dd.getParentDropDown = function (dropDown) {
   const expectedParent = dropDown.parentElement.parentElement; // Предполагаемый родитель
   return _dom.el.has("dd", expectedParent, 1) && expectedParent;
};
/**
 * Закрывать меню до текущего (закрыть ненужные)
 * @param {Element} dropDown Drop-Down
 * @param {Element} previousDropDown Предыдущий Drop-Down
 */
dd.closeAllToCurrent = function (dropDown, previousDropDown) {
   if (previousDropDown?.contains(dropDown)) return; // Если предыдущее меню не содержит текущее меню то продолжить

   let thisDropDown = previousDropDown;
   while (thisDropDown && thisDropDown !== dropDown) {
      const thisMenu = thisDropDown.lastElementChild;

      dd.close(thisMenu); // Закрыть

      if (level.get(thisMenu) === (dropDown?.lastElementChild && level.get(dropDown?.lastElementChild))) break; // Если два меню стоят на одном уровне то не закрывать родитель

      thisDropDown = dd.getParentDropDown(thisDropDown);
   }
};


/**
 * Взаимодействие со статусами Drop-Down
 * @namespace
 * @property {Function} mediaQueryList {@link status.mediaQueryList} Breakpoint для определения некоторых статусов
 * @property {Function} isClick {@link status.isClick} Статус типа события click(кнопка показа)
 * @property {Function} isPosition {@link status.isPosition} Статус использоваться выбора позиции
 * @property {Function} define {@link status.define} Определить статусы
 * @property {Function} define.click {@link status.define.click} Определяет статус click
 * @property {Function} define.position {@link status.define.position} Определяет статус position
 */
const status = {};
/**
 * Breakpoint для определения некоторых статусов
 * @type {mediaQueryList}
 */
status.mediaQueryList = _mediaQuery.list(); // * Срабатывает на md3(max)
/**
 * Статус типа события click(кнопка показа)
 * @type {boolean}
 */
status.isClick = undefined;
/**
 * Статус использоваться выбора позиции
 * @type {boolean}
 */
status.isPosition = undefined;
/**
 * Определить статусы
 * @namespace
 * @property {Function} click {@link status.define.click} Получает уровень
 * @property {Function} position {@link status.define.position} Устанавливает уровень
 */
status.define = {};
/** Определяет статус click */
status.define.click = function () {
   const condition = _is.touch || status.mediaQueryList.matches;

   (condition) ? _dom.el.add("dd-click") : _dom.el.del("dd-click");

   status.isClick = condition;
};
/** Определяет статус position */
status.define.position = function () {
   if (dd.last) while (dd.last !== null) dd.close(dd.last); // Закрыть все меню

   const condition = status.mediaQueryList.matches;

   (condition) ? _dom.el.del("dd-position") : _dom.el.add("dd-position");

   status.isPosition = !condition;
};


/**
 * Управление уровнями меню
 * @namespace
 * @property {Function} get {@link level.get} Получает уровень
 * @property {Function} set {@link level.set} Устанавливает уровень
 */
const level = {};
/**
 * Получить уровень
 * @param {Element} menu Menu
 * @returns {string} Уровень
 */
level.get = menu => (_dom.el.attr.get("dd", menu) || level.set(menu));
/**
 * Установить уровень
 * @param {Element} menu Menu
 * @returns {string} Уровень
 */
level.set = function (menu) {
   const parentMenu = menu.parentElement.parentElement;
   const previousLevel = (_dom.el.has("dd", parentMenu.parentElement, 1) && +level.get(parentMenu)) || 0;

   _dom.el.attr.set("dd", previousLevel + 1, menu);
   return `${previousLevel + 1}`;
};


/**
 * Взаимодействие с позицией меню
 * @namespace
 * @property {Function} sides {@link position.sides} Возможные позиции
 * @property {Function} get {@link position.get} Получает позицию
 * @property {Function} set {@link position.set} Устанавливает позицию
 * @property {Function} isPlaceEmpty {@link position.isPlaceEmpty} Проверяет нет ли меню на координатах
 * @property {Function} choose {@link position.choose} Выбрать позицию
 */
const position = {};
/** Возможные позиции */
position.sides = ["bottom", "right", "left", "top", "overflow"];
/**
 * Получить позицию
 * @param {Element} menu Menu
 * @returns {string} Позиция
 */
position.get = function (menu) {
   for (let i = 0; i < position.sides.length; i++) {
      const currentPosition = position.sides[i];
      const positionClass = "dd-" + currentPosition;

      if (_dom.el.has(positionClass, menu)) return currentPosition;
   }
};
/**
 * Устанавливает позицию меню
 * @param {Element} menu Menu
 * @param {string} newPosition Новая позиция
 */
position.set = function (menu, newPosition) {
   const prefix = "dd-";
   const lastPosition = position.get(menu);
   if (newPosition === lastPosition) return;
   if (lastPosition) _dom.el.del(prefix + lastPosition, menu); // Удалить предыдущею позицию

   _dom.el.add(prefix + newPosition, menu);
};
/**
 * Проверяет нет ли меню на координатах
 * @param {Element} menu Menu
 * @param {Array} coords Массив с координатами
 * @returns {boolean} Нет меню
 */
position.isPlaceEmpty = function (menu, coords) {
   if (+level.get(menu) <= 2) return true; // Если второй уровень или меньше - не выполнять потому что физически там пусто

   _dom.el.vsb.hide(menu); // Скрыть текущее чтоб не попало на глаза
   const fromPoint = document.elementFromPoint(coords[0], coords[1]);
   const menuFromPoint = fromPoint?.closest(".js_e-dd > ul");
   _dom.el.vsb.show(menu, "block"); // Вернуть

   return menuFromPoint ?
      (level.get(menuFromPoint) === level.get(menu)) ? true : false // Если на одном уровне то не возвращать
      : true; // Меню нет
};
/**
 * Выбор позиции меню
 * @param {Element} menu Menu
 */
position.choose = function (menu) {
   const menuRect = menu.getBoundingClientRect();
   const lastRect = menu.parentElement.getBoundingClientRect();
   const bodyWidth = innerWidth - (innerWidth - document.body.offsetWidth);
   const bodyHeight = innerHeight;
   const padding = level.get(menu) === "1" ? 0 : dd.PADDING;

   condition();
   /**
    * Установка позиции
    * @param {boolean} [overlap=false] Возможно ли перекрытие позапрошлого меню[false]
    */
   function condition(overlap = false) {
      const isLastItem = menu.parentElement.nextElementSibling === null;
      const isFirstItem = menu.parentElement.previousElementSibling === null;
      const space = {
         y: (bodyHeight - (lastRect.top - padding)) >= menuRect.height, // Место по вертикали (поместиться ли в экран по высоте относительно предыдущего меню)
         x: (bodyWidth - lastRect.left) >= menuRect.width, // Место по горизонтали (поместиться ли в экран по ширине относительно предыдущего меню)
         right: bodyWidth - lastRect.right, // Оставшееся место справа
         left: lastRect.left, // Оставшееся место слева
         top: lastRect.top, // Оставшееся место сверху
         bottom: bodyHeight - lastRect.bottom, // Оставшееся место снизу
      };
      const menuSize = {
         y: dd.MARGIN + menuRect.height, // Высота меню включая отступ
         x: dd.MARGIN + menuRect.width, // Ширина меню включая отступ
      };
      const coords = {
         right: [lastRect.right + dd.MARGIN, lastRect.top - padding], // Сверху справа
         left: [lastRect.left - dd.MARGIN, lastRect.top - padding], // Сверху слева
         top: [lastRect.left, lastRect.top - dd.MARGIN], // Слева сверху
         bottom: [lastRect.left, lastRect.bottom + dd.MARGIN], // Слева снизу
      };


      if ( // Bottom
         (level.get(menu) === "1" || isLastItem) && // Последний элемент в списке или если меню на первом уровне
         (space.x) &&  // Место по горизонтали слева
         (space.bottom >= menuSize.y) && // Место снизу
         (overlap || position.isPlaceEmpty(menu, coords.bottom)) // Проверка перекрытия
      ) return position.set(menu, "bottom");

      if ( // Top
         (level.get(menu) === "1" || isFirstItem) && // Последний элемент в списке или если меню на первом уровне
         (space.x) &&  // Место по горизонтали слева
         (space.top >= menuSize.y) && // Место сверху
         (overlap || position.isPlaceEmpty(menu, coords.top)) // Проверка перекрытия
      ) return position.set(menu, "top");

      if ( // Right
         (space.right >= menuSize.x) && // Место справа
         (space.y) && // Место по вертикали справа
         (overlap || position.isPlaceEmpty(menu, coords.right)) // Проверка перекрытия
      ) return position.set(menu, "right");

      if ( // Left
         (space.left >= menuSize.x) && // Место слева
         (space.y) && // Место по вертикали справа
         (overlap || position.isPlaceEmpty(menu, coords.left)) // Проверка перекрытия
      ) return position.set(menu, "left");

      if (overlap) return position.set(menu, "overflow"); // Если не одна позиция не подходит


      condition(true); // Попробовать еще раз но с разрешенным перекрытием
   }
};


/**
 * Функция для выполнения на устройстве с мышью
 * @param {Event} e Событие
 */
function mouseDeviceEvent(e) {
   if (_dom.el.has("dd-click")) return;

   const dropDown = e.target.closest(".js_e-dd");
   if (dropDown) var dropDownMenu = dropDown.lastElementChild;

   const relatedDropDown = e.relatedTarget?.closest(".js_e-dd"); // Меню с которого событие ушло
   if (!dropDown && !relatedDropDown) return;

   dd.closeAllToCurrent(dropDown, relatedDropDown);

   if (dropDown) dd.open(dropDownMenu);
}

let debouncedMouseDownEvent;

const initialization = (function init() {
   status.define.click();
   status.define.position();

   if (status.isClick) {
      if (debouncedMouseDownEvent) removeEventListener("mousedown", debouncedMouseDownEvent);
      debouncedMouseDownEvent = debounce("mousedown", 250, function (e) {
         if (!_dom.el.has("dd-click")) return;

         const button = e.target.closest("button");
         if (!button) return;
         const dropDown = button.closest(".js_e-dd");
         if (!dropDown) return;

         const dropDownMenu = dropDown.lastElementChild;

         if ((dd.last && !_is.hide(dd.last) && (dropDownMenu !== dd.last))) dd.closeAllToCurrent(dropDown, dd.last?.parentElement);

         dd.toggle(dropDownMenu);
      }, true);
   } else {
      addEventListener("focusin", mouseDeviceEvent);
      addEventListener("mouseover", mouseDeviceEvent);
   }

   return init;
})();
debounce("resize", 500, initialization);
//=======================================================================================================================================================================================================================================================