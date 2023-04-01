//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");

content.innerHTML = `<section id='target' style='top:${window.g.SIZES[1]}px;'></section>`;
const element = document.getElementById("target");

content.innerHTML += "<div class='menu'></div>";
const menu = document.querySelector(".menu");
menu.innerHTML = "<li id='li-item'></li>";

/* global scrollY:writable */
jest.mock("gsap", () => ({ // Добавить реализацию для gsap.to
   to: (element, obj) => {
      // Реализовать для JSDOM
      (typeof element.scrollY !== "undefined") ? scrollY = obj.scrollTo : element.scrollTop = obj.scrollTo; // Установить в верное место значение
   },
   registerPlugin: () => null
}));
const _scrollTo = async element => {
   const duration = await require("../../src/js/exports/scroll-to.js").default(element);
   jest.runAllTimers();

   return duration;
};
/**
 * Проверить что не прокручивалось
 * @param {number} duration Длительность анимации
 * @param {number} expectY Ожидаемый ScrollY
 */
const itDidNotScroll = (duration, expectY) => {
   expect(duration).toBe(0); // Прокрутка не выполнялась
   expect(scrollY).toBe(expectY); // Положение прокрутки после выполнения в положении sticky
};

jest.useFakeTimers();

describe("Тестирование _scrollTo", () => {
   beforeEach(() => { // Восстановить значение
      scrollY = 0;
      element.style.top = window.g.SIZES[1] + "px";
      document.body.classList.remove("js_s-sticky");
   });

   test("Простейшая прокрутка", async () => {
      await _scrollTo(element);
      expect(scrollY).toBe(window.g.SIZES[1]); // Положение прокрутки после выполнения
   });
   describe("Не прокручивается если на том же месте", () => {
      beforeEach(() => scrollY = 1000);
      test("Обычная форма", async () => {
         element.style.top = 0 + "px";
         document.body.classList.remove("js_s-sticky");

         itDidNotScroll(await _scrollTo(element), 1000);
      });
   });
});
//=======================================================================================================================================================================================================================================================