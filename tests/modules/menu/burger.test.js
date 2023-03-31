//=======================================================================================================================================================================================================================================================
import {setMedia} from "mock-match-media";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
const burger = document.body.querySelector(".js_e-burger");
const menu = document.querySelector(".menu");

/**
 * Кликать на элемент
 * @param {HTMLElement} element Элемент на который кликать
 */
const triggerMenu = element => {
   element.click();
   jest.runAllTimers();
};
/**
 * Проверить что меню открыто
 * @param {object} _lock _lock Модуль
 */
const isMenuOpened = _lock => {
   expect(menu.classList.contains("js_s-act-menu")).toBeTruthy();
   expect(document.body.classList.contains("js_s-lock")).toBeTruthy();
   expect(document.body.style.getPropertyValue("--lp")).toBe(innerWidth - document.body.offsetWidth + "px");
   expect(_lock.is).toBeFalsy();
};
/**
 * Проверить что меню закрыто
 * @param {object} _lock _lock Модуль
 */
const isMenuClosed = _lock => {
   expect(menu.classList.contains("js_s-act-menu")).toBeFalsy();
   expect(document.body.classList.contains("js_s-lock")).toBeFalsy();
   expect(document.body.style.getPropertyValue("--lp")).toBe("0");
   expect(_lock.is).toBeFalsy();
};
/**
 * Инициализировать модули
 * @returns {object} _lock Модуль
 */
const init = () => {
   require("../../../src/js/modules/menu/burger.js");

   return require("../../../src/js/exports/lock.js").default;
};
/**
 * Перенести фокус
 * @param {Element} target Цель которая потеряет фокус
 * @param {Element} relatedTarget Цель которая получит фокус
 */
const moveFocus = (target, relatedTarget) => {
   window.eventListenersList["focusout"][0]({
      type: "focusout",
      target: target,
      relatedTarget: relatedTarget
   });
   jest.runAllTimers();
};

jest.useFakeTimers();

describe("Тестирование burger", () => {
   beforeEach(() => {
      jest.resetModules();
      window.removeEventListeners();
   });

   test("Бургер определился верно", () => expect(require("../../../src/js/modules/menu/burger.js").__get__("burger")).toEqual(burger));
   test("Меню открывается и закрывается", () => {
      const _lock = init();

      triggerMenu(burger);
      isMenuOpened(_lock);

      triggerMenu(burger);
      isMenuClosed(_lock);
   });
   test("Меню закрывается при md3 min", () => {
      setMedia({width: "768px"});
      const _lock = init();

      triggerMenu(burger);
      isMenuOpened(_lock);

      burger.style.display = "none";
      setMedia({width: "769px"});
      jest.runAllTimers();
      isMenuClosed(_lock);

      setMedia({width: "768px"});
      burger.style.display = "";
   });
   test("Меню закрывается на доп элемент", () => {
      const _lock = init();
      content.innerHTML = "<div class=\"js_e-menu-close\"></div>";
      const additionalCloseElement = content.lastElementChild;

      triggerMenu(burger);
      triggerMenu(additionalCloseElement);

      isMenuClosed(_lock);
   });
   test("Закрытие при потере фокуса", () => {
      const _lock = init();

      triggerMenu(burger);
      moveFocus(burger, content);

      isMenuClosed(_lock);
   });
   describe("Не срабатывает", () => {
      test("Если фокус перешел на другой элемент шапки", () => {
         const _lock = init();

         triggerMenu(burger);
         moveFocus(burger, burger.nextElementSibling);

         isMenuOpened(_lock);
      });
      test("Если бургер скрыт", () => {
         const _lock = init();
         burger.style.display = "none";

         triggerMenu(burger);
         moveFocus(burger, burger.nextElementSibling);
         isMenuClosed(_lock);
         burger.style.display = "";
      });
      test("Если меню закрыто", () => {
         const _lock = init();

         moveFocus(burger, burger.nextElementSibling);
         isMenuClosed(_lock);
      });
      test("Если фокус теряет не шапка", () => {
         const _lock = init();

         triggerMenu(burger);
         moveFocus(content, burger.nextElementSibling);
         isMenuOpened(_lock);
      });
   });
});
//=======================================================================================================================================================================================================================================================