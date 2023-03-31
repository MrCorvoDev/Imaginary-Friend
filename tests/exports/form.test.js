//=======================================================================================================================================================================================================================================================
const _form = require("../../src/js/exports/form.js").default;
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
content.innerHTML = "<div><input type='text' name='name' data-invalid='Enter Your Name'/></div>";
const input = content.querySelector("input");

describe("Тестирование _form", () => {
   describe("err", () => {
      test("Статус ошибки добавляется", () => {
         _form.err.add(input);
         expect(input.classList.contains("js_s-invalid")).toBeTruthy();
         if (_form.__get__("isFeat").errorToParent) expect(input.parentElement.classList.contains("js_s-invalid")).toBeTruthy();
      });
      test("Статус ошибки удаляется", () => {
         _form.err.remove(input);
         expect(input.classList.contains("js_s-invalid")).toBeFalsy();
         if (_form.__get__("isFeat").errorToParent) expect(input.parentElement.classList.contains("js_s-invalid")).toBeFalsy();
      });
      test("Текст статуса ошибки добавляется", () => {
         _form.err.add(input);
         expect(input.nextElementSibling.outerHTML).toBe("<div class=\"js_e-invalid-txt\">Enter Your Name</div>");
         expect(input.classList.contains("js_s-invalid-el")).toBeTruthy();

         _form.err.add(input);
         expect(input.parentElement.children.length).toBe(2);
      });
      test("Текст статуса ошибки удаляется", () => {
         _form.err.remove(input);
         expect(input.parentElement.children.length).toBe(1);
         expect(input.classList.contains("js_s-invalid-el")).toBeFalsy();
      });
   });
   describe("foc", () => {
      test("Статус фокуса добавляется", () => {
         _form.foc.add(input);
         expect(input.classList.contains("js_s-focus")).toBeTruthy();
         if (_form.__get__("isFeat").focusToParent) expect(input.parentElement.classList.contains("js_s-focus")).toBeTruthy();
      });
      test("Статус фокуса удаляется", () => {
         _form.foc.remove(input);
         expect(input.classList.contains("js_s-focus")).toBeFalsy();
         if (_form.__get__("isFeat").focusToParent) expect(input.parentElement.classList.contains("js_s-focus")).toBeFalsy();
      });
   });
});
//=======================================================================================================================================================================================================================================================