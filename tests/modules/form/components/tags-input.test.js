//=======================================================================================================================================================================================================================================================
const content = document.body.querySelector(".content");
/**
 * Инициализировать
 * @returns {object} Object Tags Input
 */
const init = () => {
   content.innerHTML = "<div class=\"js_e-tags-input\"><ul><li><input type=\"text\" data-placeholder=\"Type Tag\"></li></ul><button type=\"button\">Add Item</button><textarea></textarea></div>";

   require("../../../../src/js/modules/form/components/tags-input.js");

   const tagsInputEl = content.firstElementChild;
   const list = tagsInputEl.firstElementChild;
   const input = list.lastElementChild.lastElementChild;
   const button = list.nextElementSibling;
   const textarea = tagsInputEl.lastElementChild;

   return {
      list,
      input,
      button,
      textarea,
   };
};
/**
 * Добавить тег
 * @param {object} obj Объект Tags Input
 * @param {string} tag Тег
 */
function addTag(obj, tag) {
   obj.input.value = tag;
   obj.button.click();
}
/**
 * Проверить что тег добавлен
 * @param {object} obj Объект Tags Input
 * @param {string} textareaValue Значение textarea
 * @param {string} tag Тег
 * @param {number} index Индекс Тег
 * @param {number} length Количество тегов
 */
function isTagAdded(obj, textareaValue, tag, index, length) {
   expect(obj.textarea.value).toBe(textareaValue);
   expect(obj.list.children[index].firstElementChild.innerHTML).toBe(tag);
   expect(obj.list.children.length - 1).toBe(length);
}
/**
 * Удалить тег
 * @param {object} obj Объект Tags Input
 * @param {number} index Индекс удаляемого тега
 */
function removeTag(obj, index) {
   const removeButton = obj.list.children[index].lastElementChild;
   removeButton.click();
}
/**
 * Проверить что тег удален
 * @param {object} obj Объект Tags Input
 * @param {string} textareaValue Значение textarea
 * @param {number} length Количество тегов
 */
function isTagRemoved(obj, textareaValue, length) {
   expect(obj.textarea.value).toBe(textareaValue);
   expect(obj.list.children.length - 1).toBe(length);
}
//=======================================================================================================================================================================================================================================================
describe("Тестирование tags-input", () => {
   test("Добавить тег", () => {
      const obj = init();
      addTag(obj, "New Tag");

      isTagAdded(obj, "new tag", "New Tag", 0, 1);
   });
   test("Добавить несколько тегов", () => {
      const obj = init();
      addTag(obj, "New Tag 1");
      isTagAdded(obj, "new tag 1", "New Tag 1", 0, 1);

      addTag(obj, "New Tag 2");
      isTagAdded(obj, "new tag 1, new tag 2", "New Tag 2", 1, 2);

      addTag(obj, "New Tag 3");
      isTagAdded(obj, "new tag 1, new tag 2, new tag 3", "New Tag 3", 2, 3);
   });
   test("Не добавлять если уже есть тег", () => {
      const obj = init();
      addTag(obj, "New Tag");
      addTag(obj, "New Tag");

      isTagAdded(obj, "new tag", "New Tag", 0, 1);
   });
   test("Удалить тег", () => {
      const obj = init();
      addTag(obj, "New Tag 1");

      removeTag(obj, 0);
      isTagRemoved(obj, "", 0);
   });
   test("Удалить несколько тегов", () => {
      const obj = init();
      addTag(obj, "New Tag 1");
      addTag(obj, "New Tag 2");
      addTag(obj, "New Tag 3");

      removeTag(obj, 1);
      isTagRemoved(obj, "new tag 1, new tag 3", 2);

      removeTag(obj, 0);
      isTagRemoved(obj, "new tag 3", 1);

      removeTag(obj, 0);
      isTagRemoved(obj, "", 0);
   });
});
//=======================================================================================================================================================================================================================================================