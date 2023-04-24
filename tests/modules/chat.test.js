//=======================================================================================================================================================================================================================================================
//* Этот тест не автономный. Ему требуется структура из файлов HTML
const defaultHTML = document.documentElement.innerHTML;
let chatEl;
let formMessageEl;
let formProfilesEl;
let formSetupEl;
let popupEl;
/**
 * Применить конфиг к форме
 * @param {object} config Конфиг
 */
function applyConfigToForm(config) {
   const elements = formSetupEl.elements;
   for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const name = element.getAttribute("name")?.match(/\[(.*?)\]/)[1];

      if (name) {
         if (element.type === "text" || element.type === "number" || element.tagName === "TEXTAREA") element.value = config[name];
         if (element.type === "checkbox") element.checked = !!config[name];
         if (element.type === "radio") element.checked = config[name] === element.value;
         if (element.tagName === "TEXTAREA") {
            element.value = config[name];
            const tags = config[name].split(", ");
            const tagsInputEl = element.parentElement;
            const list = tagsInputEl.firstElementChild;
            const input = list.lastElementChild;
            const button = element.previousElementSibling;
            for (let i = 0; i < tags.length; i++) {
               const tag = tags[i];
               input.value = tag;
               button.click();
            }
         }
      }
   }
}
/**
 * Сохранить профиль
 * @async
 * @param {string} profile Имя профиля
 */
async function saveProfile(profile) {
   const input = formProfilesEl.firstElementChild;
   const button = formProfilesEl.lastElementChild;
   input.value = profile;
   button.click();

   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
}
/**
 * Проверить сохранен ли профиль
 * @param {object} config Конфиг
 * @param {string} id ID Профиля
 */
function isProfileSaved(config, id) {
   expect(localStorage.getItem(`profile(${id})`)).toBe(JSON.stringify(config));
   expect(localStorage.getItem("profiles")).toBe(id);
}
/**
 * Проверить выбран ли профиль в select
 * @param {string} profile Имя профиля
 */
function isSelectItemChosen(profile) {
   const select = formProfilesEl.nextElementSibling.lastElementChild;

   // Проверка оригинального select
   const selectOriginal = select.firstElementChild;
   const selectOptions = selectOriginal.children;
   let selectOptionValue;
   for (let i = 0; i < selectOptions.length; i++) {
      const option = selectOptions[i];
      if (option.innerHTML === profile) selectOptionValue = option.value;
   }
   expect(selectOptionValue).toBe(selectOriginal.value);

   // Проверка сгенерированного select
   const selectEl = select.lastElementChild;
   const selectItems = selectEl.lastElementChild.children;
   let selectItemArray;
   for (let i = 0; i < selectItems.length; i++) {
      const selectItem = selectItems[i];
      if (selectItem.innerHTML === profile) selectItemArray = [selectItem.innerHTML, selectItem.style.display];
   }
   expect(selectItemArray).toEqual([profile, "none"]);

   const buttonContent = selectEl.firstElementChild.firstElementChild.firstElementChild.innerHTML;
   expect(buttonContent).toBe(profile);
}
/** Отправить форму конфигурации */
async function submitSetupForm() {
   const button = formSetupEl.lastElementChild.lastElementChild;
   button.click();

   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();

   jest.runAllTimers();
}
/**
 * Выбрать профиль
 * @async
 * @param {string} id ID Профиля
 */
async function chooseProfile(id) {
   const select = formProfilesEl.nextElementSibling.lastElementChild;
   const selectItem = select.lastElementChild;
   const selectOptions = selectItem.lastElementChild.children;
   selectOptions[id].click();

   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
}
/**
 * Конвертировать `FormData`в конфиг
 * @param {FormData} formData Дата формы
 * @returns {object} Конфиг
 */
function convertFormData(formData) {
   const newConfig = {};
   for (const el of formData.entries()) {
      const [key, value] = el;
      const newKey = key.match(/\[(.*?)\]/)[1];

      newConfig[newKey] = value;
   }
   return newConfig;
}
/**
 * Отправить сообщение
 * @async
 */
async function sendMessage() {
   const textarea = formMessageEl.firstElementChild;
   const button = formMessageEl.lastElementChild;
   textarea.value = "User's message";
   button.click();

   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
   await window.Promise.resolve();
}
window.fetch = jest.fn(() => window.Promise.resolve({json: () => ({choices: [{text: "AI Response"}]})}));
jest.useFakeTimers();
describe("Тестирование chat", () => {
   beforeEach(() => {
      localStorage.clear();
      jest.resetModules();
      window.removeEventListeners();

      document.documentElement.innerHTML = defaultHTML;

      chatEl = document.getElementById("js_e-chat");
      formMessageEl = document.getElementById("js_e-form-message");
      formProfilesEl = document.getElementById("js_e-form-profiles");
      formSetupEl = document.getElementById("js_e-form-setup");
      popupEl = document.getElementById("js_e-popup-setup");

      require("../../src/js/modules/form/submit.js");
      require("../../src/js/modules/form/placeholder.js");
      require("../../src/js/modules/form/components/select.js");
      require("../../src/js/modules/form/components/quantity.js");
      require("../../src/js/modules/form/components/tags-input.js");
      require("../../src/js/modules/popup.js");
      require("../../src/js/modules/profiles.js");
      require("../../src/js/modules/chat.js");
      jest.runAllTimers();
   });
   test("Сохранение профиля", async () => {
      const profileName = "QA Engineer";
      const config = {
         "name": "Samuel",
         "quantity": "17",
         "gender": "2",
         "hobbies": "testing code, fight bugs",
         "music-genres": "hard rock, heavy metal",
         "music-artists": "scorpions, deep purple",
         "movie-genres": "music, action",
         "movies": "almost famous, empire records",
         "profile-name": profileName,
      };
      applyConfigToForm(config);
      await saveProfile(profileName);

      isProfileSaved(config, "4");
      isSelectItemChosen(profileName);
   });
   test("Выбор Профиля", async () => {
      const id = 1;
      const config = JSON.parse(localStorage.getItem(`profile(${id})`));
      delete config["profile-name"];
      await chooseProfile(id);

      const newConfig = convertFormData(new FormData(formSetupEl));
      expect(newConfig).toEqual(config);
   });
   test("Создание друга", async () => {
      const profileName = "QA Engineer";
      const config = {
         "name": "Samuel",
         "quantity": "17",
         "gender": "2",
         "hobbies": "testing code, fight bugs",
         "music-genres": "hard rock, heavy metal",
         "music-artists": "scorpions, deep purple",
         "movie-genres": "music, action",
         "movies": "almost famous, empire records",
         "profile-name": profileName,
      };
      applyConfigToForm(config);
      await saveProfile(profileName);

      await submitSetupForm();

      delete config["profile-name"];
      expect(JSON.parse(localStorage.getItem("currentConfig"))).toEqual(config);
      expect(localStorage.getItem("messages")).toBeNull();
      expect(localStorage.getItem("data")).toBeNull();
      expect(chatEl.innerHTML).toBe("");
      expect(popupEl.classList.contains("js_s-act-popup")).toBeFalsy();
   });
   test("Отправка сообщения", async () => {
      await chooseProfile(1);
      await submitSetupForm();
      await sendMessage();

      const messages = chatEl.children;
      expect(messages[0].innerHTML).toBe("User's message");
      expect(messages[1].innerHTML).toBe("AI Response");
      expect(localStorage.getItem("messages")).toBe("[{\"role\":\"user\",\"message\":\"User's message\"},{\"role\":\"friend\",\"message\":\"AI Response\"}]");
      expect(localStorage.getItem("data")).toBe("You use this website to chat with the person. You're just a normal human being with his own business and feelings, you have your family, dreams, failures. You're not an AI. Your name is Mikkey. You're 22 years old. You're female. Your hobbies: rock 'n roll playing, spend time with groupies, hanging out with my band. Your favorite music genres: hard rock, heavy metal, glam metal. Your favorite music artists: scorpions, deep purple, def leppard. Your favorite movie genres: music, action. Your favorite movies: almost famous, empire records. If the person ignores your messages, ask if he is okay(It's important). Write your message after 'You:':\nPerson: User's message\nYou:AI Response");
   });
});
//=======================================================================================================================================================================================================================================================