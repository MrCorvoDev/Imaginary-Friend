//=======================================================================================================================================================================================================================================================
import _lock from "../../src/js/exports/lock.js";
//=======================================================================================================================================================================================================================================================
/** Проверить что блокировка прокрутки добавлена */
const isLockTrue = () => {
   jest.runAllTimers();

   expect(document.body.classList.contains("js_s-lock")).toBeTruthy();
   expect(document.body.style.getPropertyValue("--lp")).toBe(innerWidth - document.body.offsetWidth + "px");
   expect(_lock.is).toBeFalsy();
};
/** Проверить что блокировка прокрутки удалена */
const isLockFalsy = () => {
   jest.runAllTimers();

   expect(document.body.classList.contains("js_s-lock")).toBeFalsy();
   expect(document.body.style.getPropertyValue("--lp")).toBe("0");
   expect(_lock.is).toBeFalsy();
};

jest.useFakeTimers();

describe("Тестирование _lock", () => {
   beforeAll(() => _lock.is = false);
   test("Блокировка прокрутки выключена", () => expect(_lock.is).toBeFalsy());
   test("Добавить блокировку прокрутки", () => {
      _lock.add(500);

      isLockTrue();
   });
   test("Удалить блокировку прокрутки", () => {
      _lock.remove(500);

      isLockFalsy();
   });
   test("Переключить блокировку прокрутки", () => {
      _lock.toggle(500);

      isLockTrue();
   });
   describe("Если сейчас в процессе", () => {
      beforeAll(() => {
         _lock.is = true; // Эмулировать процесс
         document.body.style.setProperty("--lp", "TEST");
      });
      test("Блокировка не добавляется", () => {
         _lock.add(500);
         jest.runAllTimers();

         expect(document.body.style.getPropertyValue("--lp")).toBe("TEST");
      });
      test("Блокировка не удаляется", () => {
         _lock.remove(500);
         jest.runAllTimers();

         expect(document.body.style.getPropertyValue("--lp")).toBe("TEST");
      });
      test("Блокировка не переключается", () => {
         _lock.toggle(500);
         jest.runAllTimers();

         expect(document.body.style.getPropertyValue("--lp")).toBe("TEST");
      });
   });
});
//=======================================================================================================================================================================================================================================================