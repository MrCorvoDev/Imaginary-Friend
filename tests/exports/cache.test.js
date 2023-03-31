//=======================================================================================================================================================================================================================================================
import _handleCache, {cache} from "../../src/js/exports/cache.js";
//=======================================================================================================================================================================================================================================================
const getSum = function (a, b) {
   return _handleCache("getSum", getSumFunc, arguments);
};
const getSumFunc = jest.fn((a, b) => a + b);

describe("Тестирование _cache", () => {
   test("Кэш записывается", () => {
      getSum(1, 1);
      expect(cache["getSum"].cache["1_1_"].value).toBe(2);
   });
   test("Кэш изымается", () => {
      getSum(1, 1);
      expect(getSumFunc.mock.calls.length).toBe(1);
   });
   test("Порядок записи", () => {
      getSum(2, 1);
      getSum(3, 1);
      getSum(4, 1);

      expect([cache["getSum"].head.key, cache["getSum"].head.next.key, cache["getSum"].tail.prev.key, cache["getSum"].tail.key])
         .toEqual(["4_1_", "3_1_", "2_1_", "1_1_"]);
   });
   test("Старые записи удаляются", () => {
      getSum(5, 1);

      expect([cache["getSum"].head.key, cache["getSum"].head.next.key, cache["getSum"].tail.prev.key, cache["getSum"].tail.key, Boolean(cache["getSum"].cache["1_1_"])])
         .toEqual(["5_1_", "4_1_", "3_1_", "2_1_", false]);
   });
   test("Поддержка пользовательского ключа", () => {
      const getFullName = object => `Full Name: ${object.surname} ${object.name}`;
      (function (object) {
         return _handleCache("getFullName", getFullName, arguments, `${object.surname}_${object.name}`);
      })({name: "Smoke", surname: "Big"});

      expect(cache["getFullName"].cache["Big_Smoke"].value).toBe("Full Name: Big Smoke");
   });
});
//=======================================================================================================================================================================================================================================================