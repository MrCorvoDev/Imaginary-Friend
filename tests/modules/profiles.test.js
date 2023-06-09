//=======================================================================================================================================================================================================================================================
import "../../src/js/modules/profiles.js";
//=======================================================================================================================================================================================================================================================
describe("Тестирование profiles", () => {
   test("Сохранения профилей в localStorage", () => {
      expect(localStorage.getItem("profile(1)")).toBeTruthy();
      expect(localStorage.getItem("profile(2)")).toBeTruthy();
      expect(localStorage.getItem("profile(3)")).toBeTruthy();
      expect(localStorage.getItem("profiles")).toBe("3");
   });
});
//=======================================================================================================================================================================================================================================================