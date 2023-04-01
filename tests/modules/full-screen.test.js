//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");

/**
 * Получить высоту группы
 * @param {string} group Название Группы
 * @returns {string} Высота Группы
 */
const getHeight = group => document.body.style.getPropertyValue(`--${group}`);
/**
 * Проверить что высота устанавливается верно
 * @param {string} group Имя группы
 * @param {number} height Ожидаемая высота после инициализации
 * @param {number} resizedHeight Ожидаемая высота после resize
 */
const isHeightRight = (group, height, resizedHeight) => {
   expect(getHeight(group)).toBe(`${height}px`);

   window.innerHeight = window.g.SIZES[1] / 2;
   dispatchEvent(new Event("resize")); // Вызвать события

   expect(getHeight(group)).toBe(`${resizedHeight}px`);
};
/**
 * Создать Full-Screen
 * @param {string} settings Настройки full-screen
 */
const createVH = settings => `<div class="js_e-vh" ${settings ? `data-vh="${settings}"` : ""}></div>`;
/**
 * Инициализировать Full-Screen
 * @param {string} HTML HTML который будет вставлен в content
 */
const init = HTML => {
   content.innerHTML = HTML;

   require("../../src/js/modules/full-screen.js");
};

describe("Тестирование full-screen", () => {
   beforeEach(() => {
      jest.resetModules();
      window.innerHeight = window.g.SIZES[1];
   });

   describe("Переменная по умолчанию устанавливается", () => {
      test("Переменная по умолчанию устанавливается", () => {
         init(createVH());

         isHeightRight("vh", window.g.SIZES[1], window.g.SIZES[1] / 2);
      });
   });
   describe("Настройки", () => {
      test("Высота 50% от окна", () => {
         init(createVH("half, 50"));
         isHeightRight("vh-half", window.g.SIZES[1] / 2, window.g.SIZES[1] / 4);
      });
      test.each([
         ["px:143", window.g.SIZES[1] - 143, (window.g.SIZES[1] / 2) - 143],
         ["strong.dude", window.g.SIZES[1] - 36, (window.g.SIZES[1] / 2) - 36],
         ["strong.dude & px:19", window.g.SIZES[1] - 36 - 19, (window.g.SIZES[1] / 2) - 36 - 19],
         ["strong.dude & px:19", (window.g.SIZES[1] / 2) - 36 - 19, (window.g.SIZES[1] / 4) - 36 - 19, 50],
      ])("Вычитаемая высота в пикселях(%#)", (setting, height, resizedHeight, screenPart = 100) => {
         init(
            createVH(`subtraction, ${screenPart}, ${setting}`) +
            "<strong class=\"dude\" style=\"height:36px\"></strong>"
         );
         isHeightRight("vh-subtraction", height, resizedHeight);
      });
   });
});
//=======================================================================================================================================================================================================================================================