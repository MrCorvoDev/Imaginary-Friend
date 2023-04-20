//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал chat
 * HTML Структура: #js_e-chat+ANY+#js_e-form-message>ANY>textarea[name="ANY"]
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../exports/dom.js";
import _history from "../exports/history.js";
//=======================================================================================================================================================================================================================================================
/** Конфиг друга */
let config;
/** Форма выбора профиля */
const formProfileEl = _dom.get.one("form-profiles", 2);
/** Форма настройки */
const formSetupEl = _dom.get.one("form-setup", 2);
/** Элемент выбора профиля */
const selectEl = formProfileEl.nextElementSibling.lastElementChild;
/** Количество профилей по умолчанию */
const NUMBER_OF_PROFILES = 3;
//=======================================================================================================================================================================================================================================================
/** Взаимодействие с select */
const _select = {
   /**
    * Получить объект с данными select
    * @param {Element} select Элемент Select
    * @returns {object} Объект
    */
   toObject: select => {
      const obj = {};

      obj.originalSelect = select.firstElementChild; // Тег select
      obj.selectItem = select.lastElementChild; // Созданный элемент select
      obj.button = obj.selectItem.firstElementChild.firstElementChild.firstElementChild; // Тег span в кнопка
      obj.list = obj.selectItem.lastElementChild; // Список button тегов
      obj.id = +obj.originalSelect.lastElementChild.value + 1; // ID Для нового button

      return obj;
   },
   /**
    * Добавить элемент в select
    * @param {Element} select Элемент Select
    * @param {string} itemName Имя элемента
    * @returns {Array|undefined} Массив уведомления или undefined
    */
   applyItem: function (select, itemName) {
      const obj = this.toObject(select);

      if (!this.isItemUniq(obj.list, itemName)) return ["Profile was overwritten", "success"]; // Уведомить если профиль будет перезаписан

      obj.originalSelect.innerHTML += `<option value="${obj.id}">${itemName}</option>`;
      obj.originalSelect.value = obj.id;
      obj.button.innerHTML = itemName;
      obj.list.innerHTML += `<button type="button" data-option="${obj.id}" class="select__option js_e-sel-opt" style="display: none;">${itemName}</button>`;
   },
   /**
    * Добавить элемент в список select
    * @param {Element} select Элемент Select
    * @param {string} itemName Имя элемента
    */
   addItem: function (select, itemName) {
      const obj = this.toObject(select);

      obj.originalSelect.innerHTML += `<option value="${obj.id}">${itemName}</option>`;
      obj.list.innerHTML += `<button type="button" data-option="${obj.id}" class="select__option js_e-sel-opt">${itemName}</button>`;
   },
   /**
    * Проверить уникальный ли элемент для select и показать все элементы
    * @param {Element} list Список элементов
    * @param {string} itemName Имя элемента
    * @returns {boolean} уникальный?
    */
   isItemUniq: (list, itemName) => {
      const items = list.children;
      for (let i = 0; i < items.length; i++) {
         const item = items[i];
         const id = _dom.el.attr.get("option", item);

         if (id) _dom.el.vsb.show(item); // Показать элемент
         if (item.innerHTML.trim().toLowerCase() === itemName.trim().toLowerCase()) {
            item.parentElement.parentElement.previousElementSibling.value = id; // Установить значение для элемента select
            return false;
         }
      }

      return true;
   },
};
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
 * Сохранить профиль
 * @param {string} profileName Имя профиля
 * @returns {Array|undefined} Массив для уведомления или undefined
 */
function saveProfile(profileName) {
   const addItemToSelectMessage = _select.applyItem(selectEl, profileName); // Добавить имя профиля в select и получить массив сообщения или undefined
   const id = selectEl.firstElementChild.value;

   const currentConfig = convertFormData(new FormData(formSetupEl)); // Получить конфиг из данных формы
   currentConfig["profile-name"] = profileName; // Установить имя профиля

   localStorage.setItem(`profile(${id})`, JSON.stringify(currentConfig));
   if (id > NUMBER_OF_PROFILES) { // Обновить количество профилей
      const profilesLength = localStorage.getItem("profiles") || 0;
      localStorage.setItem("profiles", +profilesLength + 1);
   }

   if (addItemToSelectMessage) return addItemToSelectMessage;
}
formProfileEl.saveThisFriendProfile = saveProfile;
//=======================================================================================================================================================================================================================================================
/**
 * Синхронизировать контент textarea с tags input
 * @param {Element} textarea Элемент Textarea
 */
function syncTagsWithTextarea(textarea) {
   const tagsArray = textarea.value.split(", ");
   const list = textarea.previousElementSibling.previousElementSibling;
   const children = Array.from(list.children);
   children.pop(); // Удалить input из будущего цикла

   const array = children.length > tagsArray.length ? children : tagsArray; // Массив с большим количеством элементов
   for (let i = 0; i < array.length; i++) {
      const tagEl = children[i];
      const tagText = tagsArray[i];

      if (tagText) { // Добавить тег
         if (tagEl) tagEl.firstElementChild.innerHTML = tagText; // Заменить тег на новый                  
         else list.insertAdjacentHTML("afterbegin", `<li><span>${tagText}</span><button type='button'></button></li>`); // Создать новый тег
      } else tagEl.remove(); // Удалить старый тег
   }
}
/**
 * Применить профиль
 * @param {string} id ID Профиля
 */
function applyProfile(id) {
   const currentConfig = JSON.parse(localStorage.getItem(`profile(${id})`));
   const elements = formSetupEl.elements;
   for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const name = element.getAttribute("name")?.match(/\[(.*?)\]/)[1];

      if (name) {
         if (element.type === "text" || element.type === "number" || element.tagName === "TEXTAREA") element.value = currentConfig[name];
         if (element.type === "checkbox") element.checked = !!currentConfig[name];
         if (element.type === "radio") element.checked = currentConfig[name] === element.value;
         if (element.tagName === "TEXTAREA") syncTagsWithTextarea(element);
      }
   }
}
selectEl.applyFriendProfile = applyProfile;
//=======================================================================================================================================================================================================================================================
/** Генерировать prompt для AI */
function generatePromptText() {
   let data = "";

   data += "You use this website to find a new friend. You're just a normal human being with his own business and feelings, you have your family, dreams, failures. You're not an AI. ";

   data += `Your name is ${config["name"]}. `;
   data += `You're ${config["quantity"]} years old. `;
   data += `You're ${config["gender"] === 2 ? "male" : "female"}. `;
   if (config["hobbies"]) data += `Your hobbies: ${config["hobbies"]}. `;
   if (config["music-genres"]) data += `Your favorite music genres: ${config["music-genres"]}. `;
   if (config["music-artists"]) data += `Your favorite music artists: ${config["music-artists"]}. `;
   if (config["movie-genres"]) data += `Your favorite movie genres: ${config["movie-genres"]}. `;
   if (config["movies"]) data += `Your favorite movies: ${config["movies"]}. `;

   data += "Keep up the dialogue on this website:";

   return data;
}
/**
 * 
 * @param {FormData} data Данные формы
 */
function setupConfig(data) {
   config = convertFormData(data);
   localStorage.setItem("currentConfig", JSON.stringify(config));

   formSetupEl.closest(".popup").closeThisPopup(); // Закрыть попап

   message.reset(); // Удалить сообщения
   history.reset(); // Удалить историю

   history.data = generatePromptText(); // Установить новый prompt
}
formSetupEl.setupThisFriendConfig = setupConfig;
//=======================================================================================================================================================================================================================================================
/** Чат(Тело всех сообщений) */
const chat = _dom.get.one("chat", 2);
/** Форма поля ввода */
const formEl = _dom.get.one("form-message", 2);
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействия с сообщениями
 * @property {Function} create {@link message.create} Создать Элемент Сообщение
 * @property {Function} display {@link message.display} Показать Сообщение
 */
const message = {
   /**
    * Создать Элемент Сообщение
    * @param {string} content Текст Сообщение
    * @param {boolean} isUserMessage Сообщение от пользователя?
    * @param {boolean} saveInHistory Сохранять сообщение в истории
    * @returns {Element} Элемент Сообщение
    */
   create: (content, isUserMessage, saveInHistory = true) => {
      // Добавить сообщение в историю
      if (saveInHistory) history.addMessageToHistory(content, isUserMessage);

      // Создать элемент
      const MAIN_CLASS = "message";
      const modifier = isUserMessage ? "user" : "friend";
      const message = Object.assign(document.createElement("div"), {
         className: `${MAIN_CLASS} ${MAIN_CLASS}_${modifier}`,
         textContent: content
      });

      return message;
   },
   /**
    * Показать Сообщение
    * @param {Element} message Элемент Сообщения
    * @param {boolean} isUser Сообщение пользователя?
    */
   display: (message, isUser) => {
      const lastMessage = chat.lastElementChild;
      if (lastMessage && isUser && _dom.el.has("message-typing", lastMessage)) lastMessage.before(message); // Если есть анимация печатанья то добавить сообщение перед ней
      else chat.appendChild(message);

      chat.parentElement.scrollTop = chat.parentElement.scrollHeight;
      animateMessage(message, 200, isUser);
   },
   /**
    * Показать Сообщение без анимации
    * @param {Element} message Элемент Сообщения
    */
   show: message => {
      message.style.visibility = "visible";
      message.style.opacity = 1;
   },
   /** Очистить HTML сообщения */
   reset: () => chat.innerHTML = "",
};
//=======================================================================================================================================================================================================================================================
/**
 * Анимировать
 * @param {number} duration Длительность анимации
 * @param {number} initialValue Начальное значение
 * @param {number} targetValue Конечное значение
 * @param {Function} runBeforeStart Функция для запуска до старта
 * @param {Function} runStep Функция для запуска во время шага. В аргумент передается просчитанное значение value, elapsed
 */
function animate(duration, initialValue, targetValue, runBeforeStart, runStep) {
   let start;
   if (typeof runBeforeStart === "function") runBeforeStart();

   function step(currentTime) {
      start ??= currentTime;

      const elapsed = currentTime - start;
      const value = initialValue + (targetValue - initialValue) * (elapsed / duration);

      if (elapsed < duration) {
         runStep(value, elapsed);
         requestAnimationFrame(step);
      } else runStep(targetValue);
   }

   requestAnimationFrame(step);
}
/**
 * Анимировать элемент появлением
 * @param {Element} element Элемент
 * @param {number} duration Длительность анимации
 * @param {boolean} isUser Сообщение пользователя?
 */
function animateMessage(element, duration, isUser) {
   animate(duration, 0, 100,
      () => (element.style.visibility = "visible"), // Если показывается то изменить visibility на visible
      value => {
         element.style.opacity = value / 100;
         element.style.transform = `translateX(${isUser ? 100 - value : -(100 - value)}%)`;
      }
   );
}
/**
 * Создать анимацию печатанья точками
 * @returns {Element} Элемент Сообщения в котором запущена анимация
 */
function runDotTypingAnimation() {
   let messageEl = chat.lastElementChild;
   if (_dom.el.has("message-typing", messageEl)) return messageEl;

   messageEl = message.create("", false, false);
   messageEl.innerHTML = "<span></span>".repeat(3);

   _dom.el.add("message-typing", messageEl);

   message.display(messageEl, false);

   return messageEl;
}
/**
 * Прервать анимацию печатанья точками
 * @param {Element} messageEl Элемент в котором нужно остановить анимацию
 */
function stopDotTypingAnimation(messageEl) {
   _dom.el.del("message-typing", messageEl);
}
//=======================================================================================================================================================================================================================================================
/**
 * Взаимодействия с историей
 * @namespace
 * @property {string} data {@link history.data} История в виде prompt
 * @property {Array} messages {@link history.messages} История в виде массива
 * @property {Function} addMessageToHistory {@link history.addMessageToHistory} Добавить сообщение в историю
 * @property {Function} addToData {@link history.addToData} Добавить сообщение в data(prompt)
 * @property {Function} addToMessages {@link history.addToMessages} Добавить сообщение в messages
 */
const history = {
   /** История в виде prompt */
   data: "",
   /** История в виде массива */
   messages: [],
   /**
    * Добавить сообщение в историю
    * @param {string} str Сообщение
    * @param {boolean} isUser Сообщение пользователя?
    */
   addMessageToHistory: function (str, isUser) {
      this.addToData(str, isUser);
      this.addToMessages(str, isUser);
   },
   /**
    * Добавить сообщение в data(prompt)
    * @param {string} str Сообщение
    * @param {boolean} isUser Сообщение пользователя?
    */
   addToData: function (str, isUser) {
      if (isUser) this.data += "\nPerson: " + str;
      else this.data += "\nYou:" + str;
   },
   /**
    * Добавить сообщение в messages
    * @param {string} str Сообщение
    * @param {boolean} isUser Сообщение пользователя?
    */
   addToMessages: function (str, isUser) {
      this.messages.push({role: isUser ? "user" : "friend", message: str});
   },
   /** Сохранить чат */
   save: function () {
      localStorage.setItem("messages", JSON.stringify(this.messages));
      localStorage.setItem("data", this.data);
   },
   /** Загрузить чат */
   load: function () {
      const profilesList = localStorage.getItem("profiles");
      for (let profileID = NUMBER_OF_PROFILES + 1; profileID <= profilesList; profileID++) { // Добавить имена профилей в select
         const profileConfig = JSON.parse(localStorage.getItem(`profile(${profileID})`));
         const profileName = profileConfig["profile-name"];
         _select.addItem(selectEl, profileName);
      }

      const currentConfig = localStorage.getItem("currentConfig");
      if (!currentConfig) { // Если нечего не выбрано загрузить профиль по умолчанию
         config = JSON.parse(localStorage.getItem("profile(1)"));
         history.data = generatePromptText();
         return;
      }

      config = JSON.parse(currentConfig);
      history.data = generatePromptText();

      const [savedMessages, savedData] = [localStorage.getItem("messages"), localStorage.getItem("data")];
      if (!savedMessages) return;

      this.messages = JSON.parse(savedMessages);
      this.data = savedData;

      for (let i = 0; i < this.messages.length; i++) { // Загрузить историю сообщения
         const {role, message: messageText} = this.messages[i];
         const isUser = role === "user";
         const messageEl = message.create(messageText, isUser, false);

         chat.appendChild(messageEl);
         message.show(messageEl);
      }

      chat.parentElement.scrollTop = chat.parentElement.scrollHeight; // Прокрутить в конец
   },
   /** Сбросить чат */
   reset: function () {
      localStorage.removeItem("messages");
      localStorage.removeItem("data");
      this.data = "";
      this.messages = [];
   }
};
//=======================================================================================================================================================================================================================================================
/** Abort Controller */
let controller;
/** Таймер печатанья */
let typingTimeout;
/**
 * Получить сообщение друга
 * @returns {string|false} Сообщение друга или false если ошибка
 */
async function fetchFriendMessage() {
   try {
      const response = await fetch("https://api.openai.com/v1/completions", {
         signal: controller.signal,
         method: "POST",
         headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY
         },
         body: JSON.stringify({
            model: "text-davinci-003",
            prompt: history.data + "\nYou:",
            max_tokens: 150,
            temperature: 0.5
         })
      });
      const data = await response.json();

      return data.choices?.[0].text; // Вернуть сообщение друга
   } catch (error) {
      if (error.name === "AbortError") return 0;
      else return false;
   }
}
/** Отправить ответ ИИ */
async function sendAIResponse() {
   // Получить сообщение друга
   const friendMessage = runDotTypingAnimation();

   if (controller) controller.abort(); // Прервать предыдущий fetch
   controller = new AbortController();

   if (config["typing-delay"] && typingTimeout) clearTimeout(typingTimeout); // Прервать таймаут

   const friendMessageText = await fetchFriendMessage();
   if (friendMessageText === 0) return true; // Fetch прерван
   if (!friendMessageText) return friendMessageText;

   // Эмулировать печатанье
   if (config["typing-delay"]) {
      const typingTime = friendMessageText.length * 100;
      await new Promise(res => typingTimeout = setTimeout(res, typingTime));
   }

   // Показать сообщение друга
   stopDotTypingAnimation(friendMessage);
   friendMessage.textContent = friendMessageText;
   history.addMessageToHistory(friendMessageText, false);
}
/**
 * Отправить сообщение
 * @async
 * @param {FormData} personMessageText Текст сообщения
 * @returns {boolean} Успешная отправка или нет
 */
async function sendToAI(personMessageText) {
   // Показать сообщение человека
   const personMessage = message.create(personMessageText, true);
   message.display(personMessage, true);

   await sendAIResponse();

   // Сохранить переписку
   history.save();

   // Вернуть успех
   return true;
}
//=======================================================================================================================================================================================================================================================
formEl.sendMessageToFriend = sendToAI; // Установка функции для запуска при отправке формы
history.load(); // Загрузить последние данные
//=======================================================================================================================================================================================================================================================