//=======================================================================================================================================================================================================================================================
import _is from "../../src/js/exports/is.js";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");

describe("Тестирование _is", () => {
   describe("local", () => {
      content.innerHTML = "<a href='https://google.com'></a>";
      const notLocalLink = content.querySelector("a");

      content.innerHTML = "<a href='#block'></a>";
      const localLink = content.querySelector("a");

      test("'https://google.com' не ведет на текущую страницу", () => expect(_is.local("https://google.com")).toBeFalsy());
      test("'#block' ведет на текущую страницу", () => expect(_is.local("#block")).toBeTruthy());
      test("Элемент ссылки не ведет на текущую страницу", () => expect(_is.local(notLocalLink)).toBeFalsy());
      test("Элемент ссылки ведет на текущую страницу", () => expect(_is.local(localLink)).toBeTruthy());
   });
   describe("hide", () => {
      content.innerHTML = "<div></div>";
      const shownElement = content.querySelector("div");

      content.innerHTML = "<div style='display: none;'></div>";
      const hiddenElement = content.querySelector("div");

      test("Элемент показан", () => expect(_is.hide(shownElement)).toBeFalsy());
      test("Элемент скрыт", () => expect(_is.hide(hiddenElement)).toBeTruthy());
   });
   describe("range", () => {
      test("Числа 12, 16 имеют диапазон 5", () => expect(_is.range(12, 16)).toBeTruthy());
      test("Числа 38, 99 не имеют диапазон 27", () => expect(_is.range(38, 99, 27)).toBeFalsy());
   });
   describe("seen", () => {
      const HEIGHT = 100;
      content.innerHTML = `<div style='height: ${HEIGHT}px;width: ${window.g.SIZES[0]}px;'></div>`;
      const element = content.querySelector("div");

      test("Элемент виден хоть на 25%", () => {
         const result = window.g.SIZES[1] - (HEIGHT * 0.25);
         element.style.top = result - 1 + "px";
         expect(_is.seen(element, 25)).toBeTruthy();

         element.style.top = result + "px";
         expect(_is.seen(element, 25)).toBeFalsy();
      });
   });
   test("Переменная touch не определена", () => expect(_is.touch).toBeUndefined());
});
//=======================================================================================================================================================================================================================================================