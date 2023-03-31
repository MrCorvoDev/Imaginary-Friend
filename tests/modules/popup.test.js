//=======================================================================================================================================================================================================================================================
const menu = document.querySelector(".menu");
const content = document.body.querySelector(".content");
content.innerHTML = "<div id=\"js_e-popups\"></div>";
const module = require("../../src/js/modules/popup.js");
/**
 * Создать Popup
 * @param {string} name Имя Popup
 * @param {string} classes Классы Popup
 * @param {string} body Тело Popup
 */
const createPopup = (name, classes, body) => `<div id="js_e-popup-${name}" class="popup js_e-popup ${classes}"><div class="popup__content"><div class="popup__body js_e-popup-bd"><button type="button" class="popup__close js_e-close-popup"></button>${body}</div></div></div>`;
/**
 * Инициализировать Popup
 * @param {string} HTML HTML который будет вставлен в content
 * @returns {object} Popup Object
 */
const init = HTML => {
   document.getElementById("js_e-popups")?.remove();
   content.innerHTML = `<div id="js_e-popups">${HTML}</div>`;

   require("../../src/js/modules/popup.js");

   return {
      popups: content.firstElementChild.children,
      buttons: content.querySelectorAll(".js_e-close-popup"),
   };
};
/**
 * Открывает popup
 * @param {string} [name=one] Имя Popup[one]
 */
const openPopup = (name = "one") => {
   location.assign(`#js_e-popup-${name}`);
   jest.runAllTimers();
};
/**
 * Закрывает Popup
 * @param {object} obj Popup Object
 */
const closePopup = obj => {
   obj.buttons[0].click();
   jest.runAllTimers();
};
/**
 * Проверить что Popup открытый
 * @param {object} obj Popup Object
 * @param {number} [index=0] Индекс Popup[0]
 * @param {string} name Имя Popup
 */
const isPopupOpened = (obj, index = 0, name = "one") => {
   expect(document.body.classList.contains("js_s-lock")).toBeTruthy();
   expect(obj.popups[index].classList.contains("js_s-act-popup")).toBeTruthy();
   expect(history.state.popup).toBe(`js_e-popup-${name}`);
};
/**
 * Проверить что Popup закрытый
 * @param {object} obj Popup Object
 * @param {number} [index=0] Индекс Popup[0]
 */
const isPopupClosed = (obj, index = 0) => {
   expect(document.body.classList.contains("js_s-lock")).toBeFalsy();
   expect(obj.popups[index].classList.contains("js_s-act-popup")).toBeFalsy();
   expect(history.state.popup).toBe("");
};
/**
 * Проверить что история не изменилась
 * @param {number} originalHistoryLength Длина массива истории
 */
const isHistoryTheSame = originalHistoryLength => {
   expect(history.length).toBe(1 + originalHistoryLength);
   expect(history.state.popup).toBe("");
   expect(history.state.private).toBeTruthy();
};

jest.useFakeTimers();

describe("Тестирование popup", () => {
   beforeEach(() => {
      jest.resetModules();
      window.removeEventListeners();
   });

   describe("Открывается, Закрывается", () => {
      test("Без настроек", () => {
         const obj = init(createPopup("one"));

         openPopup();
         isPopupOpened(obj);

         closePopup(obj);
         isPopupClosed(obj);
      });
      if (module.__get__("isFeat").private) test("Приватный popup", () => {
         const originalHistoryLength = history.length;
         const obj = init(createPopup("one", "js_o-popup-priv"));

         openPopup();
         isHistoryTheSame(originalHistoryLength);

         closePopup(obj);
         isHistoryTheSame(originalHistoryLength);
      });
      describe("Не стандартное закрытие", () => {
         let obj;
         beforeEach(() => {
            obj = init(createPopup("one"));
            openPopup(); // Вначале открыть)
         });
         test("По клику за popup", () => {
            obj.popups[0].firstElementChild.click();
            jest.runAllTimers();

            isPopupClosed(obj);
         });
         test("По нажатию на escape", () => {
            dispatchEvent(new KeyboardEvent("keydown", {"code": "Escape"}));
            jest.runAllTimers();

            isPopupClosed(obj);
         });
         test("По истории", () => {
            history.pushState({popup: ""}, "", location.href.replace(location.hash, ""));
            dispatchEvent(new Event("popstate"));
            jest.runAllTimers();

            isPopupClosed(obj);
         });
      });
      test("Открывает popup и закрывает предыдущий открытый popup", () => {
         const obj = init(createPopup("one") + createPopup("two"));

         openPopup(); // Открытие первого popup
         openPopup("two"); // Открытие второго popup

         expect(obj.popups[0].classList.contains("js_s-act-popup")).toBeFalsy(); // Первый Закрыт
         isPopupOpened(obj, 1, "two");
      });
      test("Открывается по history.state", () => {
         const obj = init(createPopup("one"));

         history.pushState({popup: "js_e-popup-one"}, "", location.href.replace(location.hash, ""));
         dispatchEvent(new Event("popstate"));
         jest.runAllTimers();

         isPopupOpened(obj);
      });
   });
   test("В открытом меню Lock не добавляется и не удаляется повторно", () => {
      jest.mock("../../src/js/exports/lock.js", () => { // Отслеживать lock
         const module = jest.requireActual("../../src/js/exports/lock.js");
         module.default.remove = jest.fn(module.default.remove);
         module.default.add = jest.fn(module.default.add);
         return module;
      });
      const _lock = require("../../src/js/exports/lock.js").default;

      menu.classList.add("js_s-act-menu");
      document.body.style.setProperty("--lp", innerWidth - document.body.offsetWidth + "px");
      document.body.classList.add("js_s-lock"); // Эмулировать открытое меню

      const obj = init(createPopup("one"));

      openPopup();
      expect(_lock.add.mock.calls.length).toBe(0);
      expect(obj.popups[0].classList.contains("js_s-act-popup")).toBeTruthy();
      expect(history.state.popup).toBe("js_e-popup-one");

      closePopup(obj);
      expect(_lock.remove.mock.calls.length).toBe(0);
      expect(obj.popups[0].classList.contains("js_s-act-popup")).toBeFalsy();
      expect(history.state.popup).toBe("");

      menu.classList.remove("js_s-act-menu");
      document.body.style.setProperty("--lp", "");
      document.body.classList.remove("js_s-lock"); // Вернуть по умолчанию
   });
   if (module.__get__("isFeat").video) test("Youtube video", () => {
      const obj = init(createPopup("one", "", "<div class=\"js_e-popup-vid\" data-popup-vid=\"SOME_ID\"></div>"));

      openPopup();
      expect(obj.buttons[0].nextElementSibling.innerHTML).toBe("<iframe src=\"https://www.youtube.com/embed/SOME_ID?autoplay=1\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe>");

      closePopup(obj);
      expect(obj.buttons[0].nextElementSibling.innerHTML).toBe("");
   });
});
//=======================================================================================================================================================================================================================================================