//=======================================================================================================================================================================================================================================================
import fs from "fs";
import nodePath from "path";
import path from "../gulp/config/path.js";
import "mock-match-media/polyfill";
import {setMedia} from "mock-match-media";
//=======================================================================================================================================================================================================================================================
window.g = {
   HEIGHT_HEADER: {PC: 80, Mobile: 50, StickyPC: 50, StickyMobile: 30},
   SIZES: [1440, 810],
   DESIGN_WIDTH: 1440,
   MIN_WIDTH: 320,
};
//=======================================================================================================================================================================================================================================================
const html = fs.readFileSync(nodePath.resolve(`${path.dist.html}index.html`), "utf8");
document.documentElement.innerHTML = html.toString();
document.body.style.fontSize = "16px"; // Добавить размер шрифта по умолчанию
//=======================================================================================================================================================================================================================================================
Object.defineProperties(window, {
   innerWidth: { // Установить ширину окна
      writable: true,
      configurable: true,
      value: window.g.SIZES[0],
   },
   innerHeight: { // Установить высоту окна
      writable: true,
      configurable: true,
      value: window.g.SIZES[1],
   },
});
setMedia({width: window.g.SIZES[0] + "px", height: window.g.SIZES[1] + "px"});
//=======================================================================================================================================================================================================================================================
Object.defineProperties(HTMLElement.prototype, {
   offsetParent: { // Установить виден ли элемент
      get() {return this.style.display !== "none"}
   },
   offsetWidth: { // Установить ширину
      get() {return parseFloat(this.style.width) || 0}
   },
   offsetHeight: { // Установить ширину
      get() {return parseFloat(this.style.height) || 0}
   },
   getBoundingClientRect: { // Переопределить функцию для поддержки JSDOM
      value: function () {
         return {
            width: this.offsetWidth,
            height: this.offsetHeight,
            top: parseFloat(this.style.top) || 0,
            left: parseFloat(this.style.left) || 0,
            bottom: parseFloat(this.style.top || 0) + this.offsetHeight,
            right: parseFloat(this.style.left || 0) + this.offsetWidth,
            y: parseFloat(this.style.top) || 0,
            x: parseFloat(this.style.left) || 0
         };
      }
   }
});
//=======================================================================================================================================================================================================================================================
jest.mock("lodash/debounce.js", () => jest.fn(fn => fn)); // Вместо запуска debounce запускать функции напрямую
jest.mock("lodash/throttle.js", () => jest.fn(fn => fn)); // Вместо запуска throttle запускать функции напрямую
//=======================================================================================================================================================================================================================================================
window.eventListenersList = [];
window.addEventListenerBase = addEventListener; // Настоящая функция прослушки событий
window.addEventListener = function (type, listener) { // Поддельная функция прослушки событий
   window.eventListenersList[type] ??= [];
   window.eventListenersList[type].push(listener);

   window.addEventListenerBase(type, listener);
};
window.removeEventListeners = () => { // Удалить все события
   const eventTypes = Object.keys(window.eventListenersList); // Создание массива из типов события
   for (let i = 0; i < eventTypes.length; i++) {
      const eventType = eventTypes[i];
      for (let j = 0; j < window.eventListenersList[eventType].length; j++) removeEventListener(eventType, window.eventListenersList[eventType][j]);
   }
   window.eventListenersList = [];
};
//=======================================================================================================================================================================================================================================================
jest.mock("alertifyjs", () => {
   const module = jest.requireActual("alertifyjs");
   module.notify = jest.fn(module.notify);
   return module;
});
//=======================================================================================================================================================================================================================================================
const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
Object.defineProperty(document, "cookie", {
   get: function () {
      return cookieDescriptor.get.call(document);
   },
   set: function (value) {
      const regex = /domain=[^;]*/g;
      if (regex.test(value)) value = value.replace(regex, `domain=${location.hostname}`);

      cookieDescriptor.set.call(document, value);
   }
});
//=======================================================================================================================================================================================================================================================