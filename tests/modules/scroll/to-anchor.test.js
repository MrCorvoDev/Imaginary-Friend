//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");

/* global scrollY:writable */
jest.mock("gsap", () => ({ // Добавить реализацию для gsap.to
   to: (element, obj) => {
      obj.onStart();

      (typeof element.scrollY !== "undefined") ? scrollY = obj.scrollTo : element.scrollTop = obj.scrollTo; // Установить в верное место значение

      obj.onComplete();
   },
   registerPlugin: () => {}
}));
jest.mock("../../../src/js/exports/scroll-to.js");
/**
 * Инициализировать to-anchor
 * @param {string} HTML HTML который будет вставлен в content
 * @returns {Element} Первый элемент content
 */
const init = HTML => {
   content.innerHTML = HTML + "<section id=\"target\" style=\"top: 810px\"></section>";

   require("../../../src/js/modules/scroll/to-anchor.js");

   return content.firstElementChild;
};
/**
 * Создать ссылку
 * @param {string} href Пункт назначения ссылки
 */
const createLink = (href = "#target") => `<a href="${href}"></a>`;
/**
 * Проверить что scrollTo был вызван один раз
 * @param {object} scrollToModule Модуль Scroll-to
 * @param {number} scrollToCallsLength Сколько раз было вызвано
 */
const scrollToHaveBeenCalledOneTime = (scrollToModule, scrollToCallsLength) => expect(scrollToModule.mock.calls.length).toBe(scrollToCallsLength + 1);
/**
 * Проверить что scrollTo не был вызван
 * @param {object} scrollToModule Модуль Scroll-to
 * @param {number} scrollToCallsLength Сколько раз было вызвано
 */
const scrollToHaveNotBeenCalled = (scrollToModule, scrollToCallsLength) => expect(scrollToModule.mock.calls.length).toBe(scrollToCallsLength);

jest.useFakeTimers();

describe("Тестирование to-anchor", () => {
   let scrollToCallsLength;
   let scrollToModule;
   beforeEach(() => {
      jest.resetModules();
      window.removeEventListeners();

      scrollToModule = require("../../../src/js/exports/scroll-to.js").default;
      scrollToCallsLength = scrollToModule.mock.calls.length;
   });

   test("Прокрутка по клику", () => {
      const link = init(createLink());

      link.click();

      scrollToHaveBeenCalledOneTime(scrollToModule, scrollToCallsLength); // Прокрутка сработала
   });
   test("Прокрутка по истории", () => {
      init(createLink());

      history.pushState({anchor: "target"}, "", location.href.replace(location.hash, ""));
      dispatchEvent(new Event("popstate"));

      scrollToHaveBeenCalledOneTime(scrollToModule, scrollToCallsLength); // Прокрутка сработала
   });
   test("Прокрутка по адресу", async () => {
      init(createLink());

      location.hash = "#target";
      dispatchEvent(new Event("load"));
      await window.Promise.resolve();

      scrollToHaveBeenCalledOneTime(scrollToModule, scrollToCallsLength); // Прокрутка сработала
      expect(location.href).toBe("http://localhost/"); // URL вернулся в нормальный
   });
   describe("Не прокручивается если", () => {
      test("Элемента не существует", () => {
         const link = init(createLink("#casper"));

         link.click();

         scrollToHaveNotBeenCalled(scrollToModule, scrollToCallsLength); // Прокрутка не сработала
      });
      test("Клик на не ссылку", () => {
         const link = init("<span href=\"#target\"></span>");

         link.click();

         scrollToHaveNotBeenCalled(scrollToModule, scrollToCallsLength); // Прокрутка не сработала
      });
      test("Ссылка ведет на другую страницу", () => {
         const link = init(createLink("../#winchester"));

         link.click();

         scrollToHaveNotBeenCalled(scrollToModule, scrollToCallsLength); // Прокрутка не сработала
      });
      test("Ссылка ведет на popup", () => {
         const link = init(createLink("#js_e-popup-one"));
         content.innerHTML += "<div id=\"js_e-popups\"><div id=\"js_e-popup-one\" class=\"popup js_e-popup\"><div class=\"popup__content\"><div class=\"popup__body js_e-popup-bd\"><button type=\"button\" class=\"popup__close js_e-close-popup\"></button></div></div></div></div>";

         link.click();

         scrollToHaveNotBeenCalled(scrollToModule, scrollToCallsLength); // Прокрутка не сработала
      });
      test("Произошел двойной клик", async () => {
         const link = init(createLink());

         link.click();
         await window.Promise.resolve();
         link.click();
         await window.Promise.resolve();

         scrollToHaveBeenCalledOneTime(scrollToModule, scrollToCallsLength); // Прокрутка не сработала
      });
   });
   test("На время прокрутки скриптов прокрутка браузером выключается", () => {
      init(createLink());

      history.pushState({anchor: "target"}, "", location.href.replace(location.hash, ""));
      dispatchEvent(new Event("popstate"));

      expect(history.scrollRestoration).toBe("manual"); // Прокрутка браузера выключена
      jest.runAllTimers();
      expect(history.scrollRestoration).toBe("auto"); // Прокрутка браузера выключена
   });
});
//=======================================================================================================================================================================================================================================================