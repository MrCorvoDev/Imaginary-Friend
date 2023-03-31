//=======================================================================================================================================================================================================================================================
import {setMedia} from "mock-match-media";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");

/**
 * Создать Drop-Down
 * @param {string} body HTML Который будет вставлен в ul
 */
const createDD = body => `<li style="width: 70px;height: 20px;" class="js_e-dd"><div><a href=""></a><button type="button"><span></span></button></div><ul style="display:none;width: 200px;height: 300px;">${body}</ul></li>`;
/**
 * Вставить `HTML` в content и вернуть структуру
 * @param {string} HTML Который будет вставлен в content
 * @returns {Array} Структура
 */
const insert = HTML => {
   content.innerHTML = `<ul>${HTML}</ul>`;
   return createListArray(content.firstElementChild);
};
/**
 * Создать структурированный массив
 * @param {HTMLUListElement} list Список ul
 * @returns {Array.<HTMLUListElement, Array.<Array.<HTMLLIElement, Array.<HTMLUListElement, Array>>, Array.<HTMLLIElement, Array.<HTMLUListElement, Array>>>>} Структурированный массив
 */
const createListArray = list => {
   const array = [];

   for (let o = 0; o < list.children.length; o++) {
      const li = list.children[o];

      array.push([li]);
      if (li.classList.contains("js_e-dd")) array[o].push(...createListArray(li.lastElementChild)); // Если это drop-down создать в нем структуру
   }

   return array;
};
/**
 * Открыть drop-down до `level` уровня
 * @param {Array.<HTMLLIElement, Array.<HTMLUListElement, Array>>} liArray Структурированный массив li
 * @param {number} level Уровень до какого открыть
 */
const mousedownToLevel = (liArray, level) => {
   triggerDD(liArray[0]);
   for (let i = 1; i < level; i++) {
      liArray = liArray[1];
      triggerDD(liArray[0]);
   }
};
/**
 * Возбуждать drop-down
 * @param {Element} target Элемент списка
 * @param {(Element|null)} relatedTarget Добавляется в аргументы к вызову события
 * @param {string} type Тип события для возбуждения
 */
const triggerDD = (target, relatedTarget, type = "mousedown") => {
   target = type === "mousedown" ? target.querySelector("button") : target;
   window.eventListenersList[type][0]({
      target: target,
      relatedTarget: relatedTarget
   });
   jest.runAllTimers();
};
/**
 * Тестировать закрыт ли drop-down
 * @param {HTMLLIElement} dd Элемент списка
 * @param {boolean} isTouch Проверяется в режиме touch?[true]
 */
const expectClosedDropDown = (dd, isTouch = true) => {
   expect(dd.lastElementChild.style.display).toBe("none");
   if (isTouch) expect(dd.classList.contains("js_s-act-dd")).toBeFalsy();
};
/**
 * Тестировать открыт ли drop-down
 * @param {HTMLLIElement} dd Элемент списка
 * @param {boolean} isTouch Проверяется в режиме touch?[true]
 */
const expectOpenedDropDown = (dd, isTouch = true) => {
   expect(dd.lastElementChild.style.display).toBe("block");
   if (isTouch) expect(dd.classList.contains("js_s-act-dd")).toBeTruthy();
};
/**
 * Прослушивать position.choose
 * @param {object} module Модуль
 */
const spyOnPosition = module => {
   const originalPositionObject = module.__get__("position");
   originalPositionObject.choose = jest.fn(() => module.__get__("position").choose);
   module.__set__("position", originalPositionObject);
};
/** Определить touch как true один раз */
const defineTouchAsTrueOnce = () => {
   const mockFn = jest.fn().mockReturnValue(undefined).mockReturnValueOnce(true);
   jest.mock("../../../src/js/exports/is.js", () => ({
      ...jest.requireActual("../../../src/js/exports/is.js").default,
      get touch() {
         return mockFn();
      }
   }));
};
/**
 * Установить стили элементу
 * @param {Element} el Элемент
 * @param {object} styles Стили
 */
const setStyles = (el, styles) => {
   const properties = Object.keys(styles); // Создание массива из свойств
   for (let i = 0; i < properties.length; i++) el.style[properties[i]] = `${styles[properties[i]]}px`;
};
/**
 * Проверить наличие статуса
 * @param {HTMLUListElement} menu Меню
 * @param {string} status Статус
 */
const isDDHasStatus = (menu, status) => {
   expect(menu.classList.contains(`js_s-dd-${status}`)).toBeTruthy();
};
/** Проверить что click статус активирован*/
const expectClickStatusToBeTruthy = () => {
   const module = require("../../../src/js/modules/menu/drop-down.js");
   expect(module.__get__("status").isClick).toBeTruthy();
   expect(document.body.classList.contains("js_s-dd-click")).toBeTruthy();
};
/** Проверить что click статус выключен*/
const expectClickStatusToBeFalsy = () => {
   const module = require("../../../src/js/modules/menu/drop-down.js");
   expect(module.__get__("status").isClick).toBeFalsy();
   expect(document.body.classList.contains("js_s-dd-click")).toBeFalsy();
};
/** Проверить что position статус активирован*/
const expectPositionStatusToBeTruthy = () => {
   const module = require("../../../src/js/modules/menu/drop-down.js");
   expect(module.__get__("status").isPosition).toBeTruthy();
   expect(document.body.classList.contains("js_s-dd-position")).toBeTruthy();
};
/** Проверить что position статус выключен*/
const expectPositionStatusToBeFalsy = () => {
   const module = require("../../../src/js/modules/menu/drop-down.js");

   expect(module.__get__("status").isPosition).toBeFalsy();
   expect(document.body.classList.contains("js_s-dd-position")).toBeFalsy();
};
/**
 * Создать Drop-Down Object
 * @param {HTMLLIElement} dd Drop-down
 * @returns {object} Drop-down Object
 */
const createDDObj = dd => ({li: dd, menu: dd.lastElementChild});

const originalGetComputedStyle = getComputedStyle;
window.getComputedStyle = (element, pseudo) => (pseudo === ":after" && element.tagName === "UL") ? {getPropertyValue: () => "5px"} : originalGetComputedStyle(element, pseudo);

document.elementFromPoint = jest.fn(document.elementFromPoint);

setStyles(document.body, {width: 1440, height: 810});

jest.useFakeTimers();

describe("Тестирование drop-down", () => {
   beforeEach(jest.resetModules);

   describe("Использование в режиме", () => {
      describe("Click:true & Position:true", () => {
         defineTouchAsTrueOnce();
         require("../../../src/js/modules/menu/drop-down.js");

         describe("Позиции Перекрытие", () => {
            const structure = insert(
               createDD(
                  createDD(
                     createDD()
                  )
               )
            );
            const obj = createDDObj(structure[0][1][1][0]);
            const menuFromPoint = structure[0][0].lastElementChild;

            triggerDD(structure[0][0]);
            triggerDD(structure[0][1][0]);

            afterEach(() => {
               triggerDD(structure[0][1][1][0]);

               setStyles(obj.li, {top: 0, left: 0});
               setStyles(obj.menu, {height: 300, width: 200});
            });

            test("Top(перекрытие bottom)", () => {
               setStyles(obj.li, {top: 395});
               document.elementFromPoint.mockReturnValueOnce(menuFromPoint);
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "top");
            });
            test("Right(перекрытие top)", () => {
               setStyles(obj.li, {top: 105});
               setStyles(obj.menu, {height: 700});
               document.elementFromPoint.mockReturnValueOnce(menuFromPoint);
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "right");
            });
            test("Left(перекрытие right)", () => {
               setStyles(obj.li, {left: 1240});
               setStyles(obj.menu, {height: 810});
               document.elementFromPoint.mockReturnValueOnce(menuFromPoint);
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "left");
            });
            test("Bottom(перекрытие bottom)", () => {
               setStyles(obj.li, {top: 200});
               setStyles(obj.menu, {width: 1400});
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "bottom");
            });
            test("Прокручиваемый", () => {
               setStyles(obj.menu, {height: 910});
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "overflow");
            });
         });
         describe("Позиции", () => {
            const structure = insert(
               createDD(
                  createDD() +
                  createDD()
               )
            );
            const obj = createDDObj(structure[0][0]);

            afterEach(() => {
               triggerDD(obj.li);

               setStyles(obj.li, {top: 0, left: 0});
               setStyles(obj.menu, {height: 300, width: 200});
            });

            test("Bottom", () => {
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "bottom");
            });
            test("Bottom(sub-dd)", () => {
               triggerDD(obj.li);

               const objChild = createDDObj(structure[0][2][0]);
               triggerDD(objChild.li);

               isDDHasStatus(objChild.menu, "bottom");
            });
            test("Top", () => {
               setStyles(obj.li, {top: 790});
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "top");
            });
            test("Top(sub-dd)", () => {
               triggerDD(obj.li);

               const objChild = createDDObj(structure[0][1][0]);
               setStyles(objChild.li, {top: 790});
               triggerDD(objChild.li);

               isDDHasStatus(objChild.menu, "top");
            });
            test("Right", () => {
               setStyles(obj.menu, {height: 810, });
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "right");
            });
            test("Left", () => {
               setStyles(obj.li, {left: 1370});
               setStyles(obj.menu, {height: 810});
               triggerDD(obj.li);

               isDDHasStatus(obj.menu, "left");
            });
         });
      });
      describe("Click:false & Position:true", () => {
         test("Открытие и закрытие наведением", () => {
            const structure = insert(createDD());
            const obj = createDDObj(structure[0][0]);
            const module = require("../../../src/js/modules/menu/drop-down.js");

            triggerDD(obj.li, null, "mouseover");
            expect(module.__get__("dd").last).toEqual(obj.menu);
            expectOpenedDropDown(obj.li, false);

            triggerDD(content, obj.li, "mouseover");
            expect(module.__get__("dd").last).toBeNull();
            expectClosedDropDown(obj.li, false);
         });
         test("Открытие и закрытие фокусом", () => {
            const structure = insert(
               createDD()
            );
            const obj = createDDObj(structure[0][0]);
            require("../../../src/js/modules/menu/drop-down.js");

            triggerDD(obj.li, null, "focusin");
            expectOpenedDropDown(obj.li, false);

            triggerDD(content, obj.li, "focusin");
            expectClosedDropDown(obj.li, false);
         });
      });
      describe("Click:true & Position:false", () => {
         let module;
         let structure;
         let obj;

         beforeEach(() => {
            structure = insert(
               createDD() +
               createDD(
                  createDD(
                     createDD()
                  )
               )
            );
            obj = createDDObj(structure[0][0]);

            setMedia({width: "768px"});
            module = require("../../../src/js/modules/menu/drop-down.js");
            spyOnPosition(module);
         });

         test("Простое открытие и закрытие", () => {
            triggerDD(obj.li);
            expect(module.__get__("position").choose.mock.calls.length).toBe(0);
            expectOpenedDropDown(obj.li);

            triggerDD(obj.li);
            expectClosedDropDown(obj.li);
         });
         test("Закрытие хвостов и открытие меню", () => {
            mousedownToLevel(structure[1], 3); // Открыть будущие хвосты
            triggerDD(obj.li); // Открыть drop-down после которого должны закрыться хвосты

            expect(module.__get__("position").choose.mock.calls.length).toBe(0);
            expectOpenedDropDown(obj.li); // Открылось drop-down

            expectClosedDropDown(structure[1][0]);
            expectClosedDropDown(structure[1][1][0]);
            expectClosedDropDown(structure[1][1][1][0]); // Закрылись хвосты
         });
      });
   });
   describe("Режимы определяются", () => {
      describe("Click", () => {
         describe("С Помощью _is.touch", () => {
            test("Определяется", () => {
               defineTouchAsTrueOnce();
               expectClickStatusToBeTruthy();
            });
            test("Не определяется", () => {
               setMedia({width: "800px"});
               expectClickStatusToBeFalsy();
            });
         });
         describe("С Помощью md3(max)", () => {
            test("Определяется", () => {
               setMedia({width: "768px"});
               expectClickStatusToBeTruthy();
            });
            test("Не определяется", () => {
               setMedia({width: "769px"});
               expectClickStatusToBeFalsy();
            });
         });
      });
      describe("Position", () => {
         test("Определяется", () => {
            const structure = insert(
               createDD(
                  createDD()
               )
            );
            const obj = createDDObj(structure[0][0]);
            const objChild = createDDObj(structure[0][1][0]);

            setMedia({width: "800px"});
            expectPositionStatusToBeTruthy();

            triggerDD(obj.li, null, "mouseover");
            triggerDD(objChild.li, obj.li, "mouseover");

            dispatchEvent(new Event("resize"));
            expectClosedDropDown(obj.li, false);
            expectClosedDropDown(objChild.li, false);
         });
         test("Не определяется", () => {
            setMedia({width: "700px"});
            expectPositionStatusToBeFalsy();
         });
      });
   });
});
//=======================================================================================================================================================================================================================================================