//=======================================================================================================================================================================================================================================================
describe("Тестирование define-device", () => {
   beforeEach(() => {
      document.body.classList.remove("js_s-touch", "js_s-mouse");

      jest.resetModules();
   });

   test.each([
      "Android",
      "BlackBerry",
      "iPhone",
      "iPad",
      "iPod",
      "Opera Mini",
      "IEMobile",
   ])("Устройство определяется как touch(%#)", type => {
      Object.defineProperty(navigator, "userAgent", {configurable: true, value: `Mozilla/5.0 (Linux; ${type}; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36`});
      const module = require("../../src/js/modules/define-device.js");

      expect(document.body.classList.contains("js_s-touch")).toBeTruthy();
      expect(module.__get__("_is").touch).toBeTruthy();
   });
   test("Устройство определяется как mouse", () => {
      Object.defineProperty(navigator, "userAgent", {configurable: true, value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"});
      const module = require("../../src/js/modules/define-device.js");

      expect(document.body.classList.contains("js_s-touch")).toBeFalsy();
      expect(module.__get__("_is").touch).toBeFalsy();
   });
});
//=======================================================================================================================================================================================================================================================