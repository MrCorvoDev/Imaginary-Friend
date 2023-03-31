//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
const module = require("../../../../src/js/modules/form/components/select.js");

/**
 * Создать Select
 * @param {string} name Имя Select
 * @param {string} modifier Модификатор Select
 * @param {boolean} isSearch Select Search?
 * @param {string} body Тело Select
 */
const createSelect = (name, modifier, isSearch, body) => `<div><select name="${name}" data-modifier="${modifier}"${isSearch ? " class=\"js_o-sel-search\"" : ""}>${body}</select></div>`;
/**
 * Создать option
 * @param {string} content Тело Option
 * @param {string} value Значение Option
 * @param {boolean} isSelected Option Выбран?
 */
const createOption = (content, value, isSelected) => `<option value="${value}"${isSelected ? " selected" : ""}>${content}</option>`;
/**
 * Создать объект Select
 * @param {HTMLSelectElement} select Select
 * @returns {object} Object Select
 */
const createSelectObject = select => {
   const obj = {};

   obj.block = select;
   obj.original = obj.block.firstElementChild;
   obj.originalOptions = obj.original.children;
   obj.item = obj.block.lastElementChild;
   obj.title = obj.item.firstElementChild;
   obj.val = obj.title.firstElementChild.firstElementChild;
   obj.optionsBlock = obj.item.lastElementChild;
   obj.options = obj.optionsBlock.children;

   return obj;
};
/**
 * Инициализировать Select
 * @param {string} HTML HTML который будет вставлен в content
 * @returns {Array} Array Selects
 */
const init = HTML => {
   content.innerHTML = HTML;
   require("../../../../src/js/modules/form/components/select.js");

   return createSelectsArray();
};
/**
 * Создать массив Selects
 * @returns {Array} Массив Selects
 */
const createSelectsArray = () => {
   const array = [];

   const selects = document.querySelectorAll(".js_e-sel");
   for (let i = 0; i < selects.length; i++) array.push(createSelectObject(selects[i]));

   return array;
};
/**
 * Кликнуть на Select
 * @param {HTMLSelectElement} element Select
 */
const click = element => {
   if (element.classList.contains("js_e-sel-opt")) element.click();
   else {
      window.eventListenersList["mousedown"][0]({type: "mousedown", target: element});
      Object.defineProperty(document, "activeElement", {configurable: true, value: element});
      window.eventListenersList["focusin"][0]({type: "focusin", target: element});
   }
   jest.runAllTimers();
};
/**
 * Проверить что Select открыт
 * @param {HTMLSelectElement} select Select
 */
const isSelectOpened = select => {
   if (select.block.classList.contains("js_o-sel-search")) expect(select.val.value).toBe("");
   expect(select.block.classList.contains("js_s-act-sel")).toBeTruthy();
   expect(select.optionsBlock.style.display).toBe("");
};
/**
 * Проверить что Select закрыт
 * @param {HTMLSelectElement} select Select
 */
const isSelectClosed = select => {
   if (select.block.classList.contains("js_o-sel-search")) expect(select.val.value).toBe(select.val.getAttribute("value"));
   expect(select.block.classList.contains("js_s-act-sel")).toBeFalsy();
   expect(select.optionsBlock.style.display).toBe("none");
};
/**
 * Проверить что опция выбрана
 * @param {HTMLSelectElement} select Select
 * @param {Array} optionsIndex Index Array
 * @param {Array} styles Styles Array
 * @param {Array} values Values Array
 * @param {boolean} isSearch Is Select Search
 */
const isOptionSelected = (select, optionsIndex, styles, values, isSearch) => {
   expect(select.options[optionsIndex[0]].style.display).toBe(styles[0]);
   expect(select.options[optionsIndex[1]].style.display).toBe(styles[1]);
   expect(isSearch ? select.val.value : select.val.innerHTML).toBe(values[0]);
   expect(select.original.value).toBe(values[1]);
};

jest.useFakeTimers();

describe("Тестирование select", () => {
   beforeEach(() => {
      jest.resetModules();
      window.removeEventListeners();
   });

   describe("Инициализация", () => {
      describe("Placeholder", () => {
         test("Инициализация Select", () => {
            const selects = init(createSelect("select", "form", false,
               createOption("Choose The Best Hot Hatch", "") +
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ));

            expect(selects[0].block.outerHTML).toBe("<div class=\"select js_e-sel select_form\"><select name=\"select\" data-modifier=\"form\" data-default-value=\"\"><option value=\"\">Choose The Best Hot Hatch</option><option value=\"value-1\">Honda Civic Type R</option><option value=\"value-2\">Renault Megane RS</option><option value=\"value-3\">Renault Clio RS</option><option value=\"value-4\">Volkswagen Golf GTI</option></select><div class=\"select__item\"><button type=\"button\" class=\"select__title\"><span class=\"select__value\"><span>Choose The Best Hot Hatch</span></span></button><div class=\"select__options\" style=\"display:none;\"><button type=\"button\" data-option=\"\" class=\"select__option js_e-sel-opt\" style=\"display: none;\">Choose The Best Hot Hatch</button><button type=\"button\" data-option=\"value-1\" class=\"select__option js_e-sel-opt\">Honda Civic Type R</button><button type=\"button\" data-option=\"value-2\" class=\"select__option js_e-sel-opt\">Renault Megane RS</button><button type=\"button\" data-option=\"value-3\" class=\"select__option js_e-sel-opt\">Renault Clio RS</button><button type=\"button\" data-option=\"value-4\" class=\"select__option js_e-sel-opt\">Volkswagen Golf GTI</button></div></div></div>");
         });
         if (module.__get__("isFeatSelectSearch")) test("Инициализация Select Search", () => {
            const selects = init(createSelect("select", "form", true,
               createOption("Choose The Best Hot Hatch", "") +
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ));

            expect(selects[0].block.outerHTML).toBe("<div class=\"select js_e-sel select_form js_o-sel-search\"><select name=\"select\" data-modifier=\"form\" class=\"js_o-sel-search\" data-default-value=\"\"><option value=\"\">Choose The Best Hot Hatch</option><option value=\"value-1\">Honda Civic Type R</option><option value=\"value-2\">Renault Megane RS</option><option value=\"value-3\">Renault Clio RS</option><option value=\"value-4\">Volkswagen Golf GTI</option></select><div class=\"select__item\"><button type=\"button\" tabindex=\"-1\" class=\"select__title\"><span class=\"select__value\"><input type=\"text\" name=\"form[sel-inp]\" value=\"Choose The Best Hot Hatch\" class=\"select__input js_e-sel-input\"></span></button><div class=\"select__options\" style=\"display:none;\"><button type=\"button\" data-option=\"\" class=\"select__option js_e-sel-opt\" style=\"display: none;\">Choose The Best Hot Hatch</button><button type=\"button\" data-option=\"value-1\" class=\"select__option js_e-sel-opt\">Honda Civic Type R</button><button type=\"button\" data-option=\"value-2\" class=\"select__option js_e-sel-opt\">Renault Megane RS</button><button type=\"button\" data-option=\"value-3\" class=\"select__option js_e-sel-opt\">Renault Clio RS</button><button type=\"button\" data-option=\"value-4\" class=\"select__option js_e-sel-opt\">Volkswagen Golf GTI</button></div></div></div>");
         });
      });
      describe("Простой", () => {
         test("Инициализация Select", () => {
            const selects = init(createSelect("select", "form", false,
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ));

            expect(selects[0].block.outerHTML).toBe("<div class=\"select js_e-sel select_form\"><select name=\"select\" data-modifier=\"form\" data-default-value=\"value-1\"><option value=\"value-1\">Honda Civic Type R</option><option value=\"value-2\">Renault Megane RS</option><option value=\"value-3\">Renault Clio RS</option><option value=\"value-4\">Volkswagen Golf GTI</option></select><div class=\"select__item\"><button type=\"button\" class=\"select__title\"><span class=\"select__value\"><span>Honda Civic Type R</span></span></button><div class=\"select__options\" style=\"display:none;\"><button type=\"button\" data-option=\"value-1\" class=\"select__option js_e-sel-opt\" style=\"display: none;\">Honda Civic Type R</button><button type=\"button\" data-option=\"value-2\" class=\"select__option js_e-sel-opt\">Renault Megane RS</button><button type=\"button\" data-option=\"value-3\" class=\"select__option js_e-sel-opt\">Renault Clio RS</button><button type=\"button\" data-option=\"value-4\" class=\"select__option js_e-sel-opt\">Volkswagen Golf GTI</button></div></div></div>");
         });
         if (module.__get__("isFeatSelectSearch")) test("Инициализация Select Search", () => {
            const selects = init(createSelect("select", "form", true,
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ));

            expect(selects[0].block.outerHTML).toBe("<div class=\"select js_e-sel select_form js_o-sel-search\"><select name=\"select\" data-modifier=\"form\" class=\"js_o-sel-search\" data-default-value=\"value-1\"><option value=\"value-1\">Honda Civic Type R</option><option value=\"value-2\">Renault Megane RS</option><option value=\"value-3\">Renault Clio RS</option><option value=\"value-4\">Volkswagen Golf GTI</option></select><div class=\"select__item\"><button type=\"button\" tabindex=\"-1\" class=\"select__title\"><span class=\"select__value\"><input type=\"text\" name=\"form[sel-inp]\" value=\"Honda Civic Type R\" class=\"select__input js_e-sel-input\"></span></button><div class=\"select__options\" style=\"display:none;\"><button type=\"button\" data-option=\"value-1\" class=\"select__option js_e-sel-opt\">Honda Civic Type R</button><button type=\"button\" data-option=\"value-2\" class=\"select__option js_e-sel-opt\">Renault Megane RS</button><button type=\"button\" data-option=\"value-3\" class=\"select__option js_e-sel-opt\">Renault Clio RS</button><button type=\"button\" data-option=\"value-4\" class=\"select__option js_e-sel-opt\">Volkswagen Golf GTI</button></div></div></div>");
         });
      });
   });
   describe("Открытие/Закрытие select", () => {
      test("Простое", () => {
         const selects = init(
            createSelect("select-1", "form-1", false,
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ) +
            createSelect("select-2", "form-2", false,
               createOption("First", "value-1") +
               createOption("Second", "value-2") +
               createOption("Third", "value-3") +
               createOption("Fourth", "value-4")
            )
         );

         click(selects[0].item);
         isSelectOpened(selects[0]); // Простое открытие

         click(selects[0].item);
         isSelectClosed(selects[1]); // Простое закрытие

         click(selects[0].item);
         click(selects[1].item);

         isSelectClosed(selects[0]);
         isSelectOpened(selects[1]); // Переключение

         window.eventListenersList["keydown"][0]({code: "Escape"});
         jest.runAllTimers();

         isSelectClosed(selects[1]); // Закрытие на Escape

         click(selects[1].item);
         click(content);

         isSelectClosed(selects[1]); // Закрытие на клик на content
      });
      if (module.__get__("isFeatSelectSearch")) test("Search", () => {
         const selects = init(
            createSelect("select-1", "form-1", true,
               createOption("Honda Civic Type R", "value-1") +
               createOption("Renault Megane RS", "value-2") +
               createOption("Renault Clio RS", "value-3") +
               createOption("Volkswagen Golf GTI", "value-4")
            ) +
            createSelect("select-2", "form-2", true,
               createOption("First", "value-1") +
               createOption("Second", "value-2") +
               createOption("Third", "value-3") +
               createOption("Fourth", "value-4")
            )
         );

         click(selects[0].item);
         isSelectOpened(selects[0]); // Простое открытие

         click(selects[0].item);
         isSelectClosed(selects[1]); // Простое закрытие

         click(selects[0].item);
         click(selects[1].item);

         isSelectClosed(selects[0]);
         isSelectOpened(selects[1]); // Переключение

         window.eventListenersList["keydown"][0]({code: "Escape"});
         jest.runAllTimers();

         isSelectClosed(selects[1]); // Закрытие на Escape
      });
   });
   describe("Выбор option", () => {
      test("Простой выбор + placeholder", () => {
         let selects = init(createSelect("select-1", "form-1", false,
            createOption("Choose The Best Hot Hatch", "") +
            createOption("Honda Civic Type R", "value-1") +
            createOption("Renault Megane RS", "value-2") +
            createOption("Renault Clio RS", "value-3") +
            createOption("Volkswagen Golf GTI", "value-4")
         ));

         click(selects[0].item);
         click(selects[0].options[1]);

         selects = createSelectsArray();

         isSelectClosed(selects[0]);
         isOptionSelected(selects[0], [1, 0], ["none", "none"], ["Honda Civic Type R", "value-1"]);

         click(selects[0].item);
         click(selects[0].options[2]);

         selects = createSelectsArray();

         isSelectClosed(selects[0]);
         isOptionSelected(selects[0], [2, 1], ["none", ""], ["Renault Megane RS", "value-2"]);
      });
      if (module.__get__("isFeatSelectSearch")) test("Выбор option search + placeholder", () => {
         let selects = init(createSelect("select-1", "form-1", true,
            createOption("Choose The Best Hot Hatch", "") +
            createOption("Honda Civic Type R", "value-1") +
            createOption("Renault Megane RS", "value-2") +
            createOption("Renault Clio RS", "value-3") +
            createOption("Volkswagen Golf GTI", "value-4")
         ));

         click(selects[0].item);
         click(selects[0].options[1]);

         selects = createSelectsArray();

         isSelectClosed(selects[0]);
         isOptionSelected(selects[0], [1, 0], ["", "none"], ["Honda Civic Type R", "value-1"], true);

         click(selects[0].item);
         click(selects[0].options[2]);

         selects = createSelectsArray();

         isSelectClosed(selects[0]);
         isOptionSelected(selects[0], [2, 1], ["", ""], ["Renault Megane RS", "value-2"], true);
      });
   });
   if (module.__get__("isFeatSelectSearch")) describe("Поиск", () => {
      test("Placeholder", () => {
         const selects = init(createSelect("select-1", "form-1", true,
            createOption("Choose The Best Hot Hatch", "") +
            createOption("Honda Civic Type R", "value-1") +
            createOption("Renault Megane RS", "value-2") +
            createOption("Renault Clio RS", "value-3") +
            createOption("Volkswagen Golf GTI", "value-4")
         ));

         click(selects[0].item);
         selects[0].val.value = "Choose The Best Hot Hatch";
         window.eventListenersList["keyup"][0]({target: selects[0].val});

         expect(selects[0].options[0].style.display).toBe("none");
         expect(selects[0].options[1].style.display).toBe("");
         expect(selects[0].options[2].style.display).toBe("");
         expect(selects[0].options[3].style.display).toBe("");
         expect(selects[0].options[4].style.display).toBe("");
      });
      test("Простой", () => {
         const selects = init(createSelect("select-1", "form-1", true,
            createOption("Honda Civic Type R", "value-1") +
            createOption("Renault Megane RS", "value-2") +
            createOption("Renault Clio RS", "value-3") +
            createOption("Volkswagen Golf GTI", "value-4")
         ));

         click(selects[0].item);
         selects[0].val.value = "Clio";
         window.eventListenersList["keyup"][0]({target: selects[0].val});

         expect(selects[0].options[0].style.display).toBe("none");
         expect(selects[0].options[1].style.display).toBe("none");
         expect(selects[0].options[2].style.display).toBe("");
         expect(selects[0].options[3].style.display).toBe("none");
      });
   });
});
//=======================================================================================================================================================================================================================================================