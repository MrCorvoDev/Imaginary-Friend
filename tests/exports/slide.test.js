//=======================================================================================================================================================================================================================================================
import _slide from "../../src/js/exports/slide.js";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
content.innerHTML = "<div></div>";
const element = content.querySelector("div");

jest.useFakeTimers();

describe("Тестирование _slide", () => {
   test("Закрытие слайдом", () => {
      _slide.up(element);

      expect(content.innerHTML).toBe("<div class=\"js_s-slide\" style=\"transition-property: height, margin, padding; transition-duration: 500ms; height: 0px; overflow: hidden; padding-top: 0px; padding-bottom: 0px; margin-top: 0px; margin-bottom: 0px;\"></div>");
      jest.runAllTimers();
      expect(content.innerHTML).toBe("<div class=\"\" style=\"display: none;\"></div>");
   });
   test("Открытие слайдом", () => {
      _slide.down(element);

      expect(content.innerHTML).toBe("<div class=\"js_s-slide\" style=\"overflow: hidden; height: 0px; transition-property: height, margin, padding; transition-duration: 500ms;\"></div>");
      jest.runAllTimers();
      expect(content.innerHTML).toBe("<div class=\"\" style=\"\"></div>");
   });
   test("Переключение слайдом", () => {
      _slide.toggle(element);

      expect(content.innerHTML).toBe("<div class=\"js_s-slide\" style=\"transition-property: height, margin, padding; transition-duration: 500ms; height: 0px; overflow: hidden; padding-top: 0px; padding-bottom: 0px; margin-top: 0px; margin-bottom: 0px;\"></div>");
      jest.runAllTimers();
      expect(content.innerHTML).toBe("<div class=\"\" style=\"display: none;\"></div>");
   });
});
//=======================================================================================================================================================================================================================================================