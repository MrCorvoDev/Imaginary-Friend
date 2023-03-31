//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
/**
 * Создать Input
 * @param {string} attributes Атрибуты Input
 * @returns {string} Input HTML
 */
const createInput = attributes => `<input type="text" ${attributes}/>`;
/**
 * Инициализировать
 * @param {string} HTML Который будет вставлен в content
 * @returns {Element} Первый элемент
 */
const init = HTML => {
   content.innerHTML = HTML;
   require("../../../src/js/modules/form/placeholder.js");
   return content.firstElementChild;
};
/**
 * Возбуждать input
 * @param {Element} target Цель события
 * @param {string} type Тип события для возбуждения
 */
const triggerInput = (target, type = "focusin") => {
   window.eventListenersList[type][0]({target: target});
};
/**
 * Проверить есть ли статус
 * @param {Element} element Элемент
 * @param {string} status Статус
 */
const hasStatus = (element, status) => expect(element.classList.contains(`js_s-${status}`)).toBeTruthy();
/**
 * Проверить нет ли статуса
 * @param {Element} element Элемент
 * @param {string} status Статус
 */
const hasNotStatus = (element, status) => expect(element.classList.contains(`js_s-${status}`)).toBeFalsy();

const module = require("../../../src/js/modules/form/placeholder.js");

describe("Тестирование placeholder", () => {
   beforeEach(jest.resetModules);

   describe("Выполняется сразу", () => {
      test("Placeholder устанавливается", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Name\""));

         expect(input.value).toBe("Name");
      });
      test("Placeholder не устанавливается если есть значение", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Name\" value=\"Agent 47\""));

         expect(input.value).toBe("Agent 47");
      });
   });
   describe("Переключение статусов", () => {
      if (module.__get__("isFeat").datepicker) test("Date Picker Range Статус фокус добавляется(возможная ошибка удаляется)", () => {
         const input = init(
            createInput("class=\"js_e-input js_s-invalid\" data-datepicker=\"item\"") +
            createInput("class=\"js_e-input js_s-invalid\" data-datepicker=\"item\"")
         );

         input.datepicker = {};
         input.datepicker.rangepicker = {};
         input.datepicker.rangepicker.inputs = [input, input.nextElementSibling];

         triggerInput(input);

         hasNotStatus(input, "invalid");
         hasNotStatus(input.nextElementSibling, "invalid");
         hasStatus(input, "focus");
      });
      test("Статус фокус добавляется(возможная ошибка удаляется)", () => {
         const input = init(createInput("class=\"js_e-input js_s-invalid\""));
         triggerInput(input);

         hasNotStatus(input, "invalid");
         hasStatus(input, "focus");
      });
      test("Статус фокус удаляется", () => {
         const input = init(createInput("class=\"js_e-input\""));
         triggerInput(input, "focusout");

         hasNotStatus(input, "focus");
      });
   });
   describe("Placeholder input", () => {
      test("При фокусе удаляется placeholder", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Name\""));
         triggerInput(input);

         expect(input.value).toBe("");
      });
      test("При потере фокуса placeholder устанавливается", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Name\""));
         triggerInput(input, "focusout");

         expect(input.value).toBe("Name");
      });
      test("При потере фокуса значение остается если оно есть", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Name\""));
         input.value = "Mr.Robot";
         triggerInput(input, "focusout");

         expect(input.value).toBe("Mr.Robot");
      });
      if (module.__get__("isFeat").datepicker) test("При потере фокуса placeholder возвращается обоим Date Picker", () => {
         const input = init(
            createInput("class=\"js_e-input js_s-invalid\" data-placeholder=\"Date\" data-datepicker=\"item\"") +
            createInput("class=\"js_e-input js_s-invalid\" data-placeholder=\"Date\" data-datepicker=\"item\"")
         ).nextElementSibling;
         input.datepicker = {};
         input.datepicker.rangepicker = {};
         input.datepicker.rangepicker.inputs = [input.previousElementSibling, input];

         triggerInput(input);
         triggerInput(input, "focusout");

         expect(input.previousElementSibling.value).toBe("Date");
         expect(input.value).toBe("Date");
      });
   });
   if (module.__get__("isFeat").password) describe("Password input", () => {
      test("При получении фокуса устанавливается тип password", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Enter Your Password\" data-type=\"pass\""));
         triggerInput(input);

         expect(input.getAttribute("type")).toBe("password");
      });
      test("При потере фокуса если пуст тип возвращается на text", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Enter Your Password\" data-type=\"pass\""));
         triggerInput(input);
         triggerInput(input, "focusout");

         expect(input.getAttribute("type")).toBe("text");
      });
      test("При потере фокуса если значение есть оно остается", () => {
         const input = init(createInput("class=\"js_e-input\" data-placeholder=\"Enter Your Password\" data-type=\"pass\""));
         triggerInput(input);
         input.value = "qwerty";
         triggerInput(input, "focusout");

         expect(input.getAttribute("type")).toBe("password");
      });
   });
});
//=======================================================================================================================================================================================================================================================