//=======================================================================================================================================================================================================================================================
import _header from "../../src/js/exports/header.js";
jest.mock("../../src/js/exports/header.js", () => ({
   ...jest.requireActual("../../src/js/exports/header.js").default,
   get stk() {
      return true;
   }
}));
import "../../src/js/modules/sticky.js";
//=======================================================================================================================================================================================================================================================
/* global scrollY:writable */
/**
 * Вызвать событие scroll на позиции `y`
 * @param {number} y Число прокрученных пикселей
 */
const scrollOn = y => {
   scrollY = y;
   dispatchEvent(new Event("scroll"));
};

/** Проверить что шапка sticky */
const isHeaderSticky = () => expect(document.body.classList.contains("js_s-sticky")).toBeTruthy();
/** Проверить не что шапка sticky */
const isNotHeaderSticky = () => expect(document.body.classList.contains("js_s-sticky")).toBeFalsy();

const spy = jest.spyOn(_header, "stk", "get");

describe("Тестирование sticky", () => {
   beforeEach(() => {
      scrollY = 0;
      spy.mockReturnValue(true);
   });

   test("Шапка меняет форму только после того как окно прокрутило больше ее высоты", () => {
      const originalClasses = document.body.classList.value;

      scrollOn(window.g.HEIGHT_HEADER.PC - 1);
      expect(document.body.classList.value).toBe(originalClasses); // Шапка в обычном положении

      scrollOn(window.g.HEIGHT_HEADER.PC + 1);
      expect(document.body.classList.value).not.toBe(originalClasses); // Шапка в положении sticky
   });
   describe("Переключение формы", () => {
      test("Форма меняется на Sticky", () => {
         scrollOn(window.g.HEIGHT_HEADER.PC * 10);

         isHeaderSticky();
      });
      test("Форма возвращается на обычную", () => {
         scrollOn(window.g.HEIGHT_HEADER.PC * 10);
         scrollOn(window.g.HEIGHT_HEADER.PC * 5);

         isNotHeaderSticky();
      });
   });
   describe("Отключение смены формы", () => {
      beforeEach(() => spy.mockReturnValue(false));
      test("Форма остается Sticky", () => {
         document.body.classList.add("js_s-sticky");

         scrollOn(window.g.HEIGHT_HEADER.PC * 10);
         scrollOn(window.g.HEIGHT_HEADER.PC * 5);
         isHeaderSticky();
      });
      test("Форма остается обычной", () => {
         document.body.classList.remove("js_s-sticky");

         scrollOn(window.g.HEIGHT_HEADER.PC * 10);
         isNotHeaderSticky();
      });
   });
});
//=======================================================================================================================================================================================================================================================