//=======================================================================================================================================================================================================================================================
import _history from "../../src/js/exports/history.js";
//=======================================================================================================================================================================================================================================================
describe("Тестирование _history", () => {
   test("Добавить запись в историю", () => {
      _history.push("data", "off");

      expect(history.state.data).toBe("off");
   });
   test("Добавить запись в историю с якорем", () => {
      location.href = location.href + "#block";
      _history.hash("anchor", "#block");
      expect(history.state.anchor === "#block").toBeTruthy();
      expect(location.href.indexOf("#block") === -1).toBeTruthy();
   });
   test("Перезаписать запись истории после приватной записи", () => {
      location.href = location.href + "#block";
      _history.hash("anchor", "#block", true);

      _history.push("data", "off");
      expect(history.state.data === "off").toBeTruthy();
      expect(history.length === 4).toBeTruthy();
   });
});
//=======================================================================================================================================================================================================================================================