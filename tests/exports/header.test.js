//=======================================================================================================================================================================================================================================================
import _header from "../../src/js/exports/header.js";
//=======================================================================================================================================================================================================================================================
describe("Тестирование _header", () => {
   test("Menu определено", () => {
      const element = document.querySelector(".menu");

      expect(_header.menu).toEqual(element);
   });
   test("Menu Body определено", () => {
      const element = document.querySelector(".js_e-menu-bd");

      expect(_header.menuBD).toEqual(element);
   });
   test("Переменные высоты шапки установлены", () => expect(
      [document.body.style.getPropertyValue("--headerH"), document.body.style.getPropertyValue("--headerSH")]).toEqual([`${window.g.HEIGHT_HEADER.PC}px`, `${window.g.HEIGHT_HEADER.StickyPC}px`]));
   test("Переменные высоты шапки меняются при resize", () => {
      window.innerWidth = window.g.MIN_WIDTH; // Изменить ширину
      dispatchEvent(new Event("resize")); // Вызвать события
      expect([document.body.style.getPropertyValue("--headerH"), document.body.style.getPropertyValue("--headerSH")]).toEqual([`${window.g.HEIGHT_HEADER.Mobile}px`, `${window.g.HEIGHT_HEADER.StickyMobile}px`]);
   });
});
//=======================================================================================================================================================================================================================================================