//=======================================================================================================================================================================================================================================================
import {debounce, throttle} from "../../src/js/exports/lodash.js";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
content.innerHTML = "<div></div>";
const element = content.querySelector("div");

/** Кликнуть на переданные элементы*/
function click() {
   for (var i = 0; i < arguments.length; i++) arguments[i].click();
}

describe("Тестирование lodash", () => {
   let fn = jest.fn();
   afterEach(() => fn = jest.fn());

   describe("debounce", () => {
      test("Событие добавляется на элемент", () => {
         debounce("click", 250, fn, {}, element); // Отслеживание клика на element

         click(document.body, element);

         expect(fn.mock.calls.length).toBe(1);
      });
      test("Событие добавляется на body", () => {
         debounce("click", 250, fn, {});

         click(document.body, element);

         expect(fn.mock.calls.length).toBe(2);
      });
   });
   describe("throttle", () => {
      test("Событие добавляется на элемент", () => {
         throttle("click", 250, fn, {}, element); // Отслеживание клика на element

         click(document.body, element);

         expect(fn.mock.calls.length).toBe(1);
      });
      test("Событие добавляется на body", () => {
         throttle("click", 250, fn, {});

         click(document.body, element);

         expect(fn.mock.calls.length).toBe(2);
      });
   });
});
//=======================================================================================================================================================================================================================================================