//=======================================================================================================================================================================================================================================================
import _dom from "../../src/js/exports/dom.js";
//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
const multiply = (value, times) => {
   let result = "";
   for (let i = 0; i < times; i++) result += value;
   return result;
};

describe("Тестирование _dom", () => {
   describe("get", () => {
      describe("one", () => {
         test("Получить элемент item по классу из DOM", () => {
            content.innerHTML = "<div class='js_e-item'></div>";
            const element = content.querySelector(".js_e-item");

            expect(_dom.get.one("item")).toEqual(element);
         });
         test("Получить элемент item по ID из DOM", () => {
            content.innerHTML = "<div id='js_e-item'></div>";
            const element = content.querySelector("#js_e-item");

            expect(_dom.get.one("item", 2)).toEqual(element);
         });
         test("Получить элемент item по атрибуту из DOM", () => {
            content.innerHTML = "<div data-item></div>";
            const element = content.querySelector("[data-item]");

            expect(_dom.get.one("item", 3)).toEqual(element);
         });
         test("Получить элемент по селектору span.js_e-item из DOM", () => {
            content.innerHTML = "<span class='js_e-item'></span>";
            const element = content.querySelector("span.js_e-item");

            expect(_dom.get.one("span.js_e-item", 4)).toEqual(element);
         });
         test("Получить элемент item по классу из элемента main DOM", () => {
            content.innerHTML = "<section><div class='js_e-item'></div></section>";
            const parent = content.querySelector("section");
            const element = parent.querySelector(".js_e-item");

            expect(_dom.get.one("item", 1, parent)).toEqual(element);
         });
      });

      describe("all", () => {
         test("Получить элементы item по классу из DOM", () => {
            content.innerHTML = multiply("<div class='js_e-item'></div>", 2);
            const elements = content.getElementsByClassName("js_e-item");

            expect(_dom.get.all("item")).toEqual(elements);
         });
         test("Получить элементы item по атрибуту из DOM", () => {
            content.innerHTML = multiply("<div data-item></div>", 2);
            const elements = content.querySelectorAll("[data-item]");

            expect(_dom.get.all("item", 2)).toEqual(elements);
         });
         test("Получить элементы item по селектору span.js_e-item из DOM", () => {
            content.innerHTML = multiply("<span class='js_e-item'></span>", 2);
            const elements = content.querySelectorAll("span.js_e-item");

            expect(_dom.get.all("span.js_e-item", 3)).toEqual(elements);
         });
         test("Получить элементы item по имени тега strong из DOM", () => {
            content.innerHTML = multiply("<strong></strong>", 2);
            const elements = content.getElementsByTagName("strong");

            expect(_dom.get.all("strong", 4)).toEqual(elements);
         });
         test("Получить элементы item по классу из элемента main DOM", () => {
            content.innerHTML = `<main>${multiply("<div class='js_e-item'></div>", 2)}</main>`;
            const parent = content.querySelector("main");
            const elements = parent.getElementsByClassName("js_e-item");

            expect(_dom.get.all("item", 1, parent)).toEqual(elements);
         });
      });
   });

   describe("el", () => {
      describe("has", () => {
         content.innerHTML = "<div data-name class='js_e-item js_o-edit'></div>";
         const element = content.querySelector(".js_e-item");

         test("Cтатуса active нет", () => expect(_dom.el.has("active", element)).toBeFalsy());
         test("Класс элемента item есть", () => expect(_dom.el.has("item", element, 1)).toBeTruthy());
         test("Опция edit есть", () => expect(_dom.el.has("edit", element, 3)).toBeTruthy());
         test("Атрибут name есть", () => expect(_dom.el.has("name", element, 4)).toBeTruthy());
      });

      test("Добавить/Удалить/Переключить статус active", () => {
         content.innerHTML = "<div></div>";
         const element = content.querySelector("div");

         _dom.el.add("active", element);

         expect(_dom.el.has("active", element)).toBeTruthy();

         _dom.el.del("active", element);

         expect(_dom.el.has("active", element)).toBeFalsy();

         _dom.el.tgl("active", element);

         expect(_dom.el.has("active", element)).toBeTruthy();
      });


      describe("offset", () => {
         content.innerHTML = "<section><div></div></section>";
         const element = content.querySelector("div");
         test("Получить нулевые координаты элемента", () => expect(_dom.el.offset(element)).toEqual({top: 0, left: 0}));
         test("Получить нулевые координаты элемента в элементе с прокруткой", () => expect(_dom.el.offset(element, element.parentElement)).toEqual({top: 0, left: 0}));
      });

      describe("attr", () => {
         content.innerHTML = "<div data-info='CONTENT'></div>";
         const element = content.querySelector("div");
         test("Получить значение CONTENT атрибута info", () => expect(_dom.el.attr.get("info", element)).toBe("CONTENT"));
         test("Установить значение ADDITIONAL атрибуту info", () => {
            _dom.el.attr.set("info", "ADDITIONAL", element);

            expect(element.getAttribute("data-info")).toBe("ADDITIONAL");
         });
      });

      describe("vsb", () => {
         content.innerHTML = "<div></div>";
         const element = content.querySelector("div");
         test("Показать элемент", () => {
            element.style.display = "none";
            _dom.el.vsb.show(element);

            expect(element.outerHTML).toEqual("<div style=\"\"></div>");
         });
         test("Скрыть элемент", () => {
            _dom.el.vsb.hide(element);

            expect(element.outerHTML).toEqual("<div style=\"display: none;\"></div>");
         });
         test("Переключить видимость элементу", () => {
            _dom.el.vsb.tgl(element);

            expect(element.outerHTML).toEqual("<div style=\"\"></div>");
         });
         test("Показать flex элемент", () => {
            element.style.display = "none";
            _dom.el.vsb.show(element, "flex");

            expect(element.outerHTML).toEqual("<div style=\"display: flex;\"></div>");
         });
      });
   });
});
//=======================================================================================================================================================================================================================================================