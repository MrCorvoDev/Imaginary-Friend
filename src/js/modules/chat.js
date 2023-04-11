//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал chat
 * HTML Структура: #js_e-chat+ANY+#js_e-form-message>ANY>textarea[name="ANY"]
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../exports/dom.js";
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
      chat.appendChild(message);
      chat.parentElement.scrollTop = chat.parentElement.scrollHeight;
      animateMessage(message, 200, isUser);
   }
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
/** Создать анимацию печатанья точками */
function runDotTypingAnimation() {
   const messageEl = message.create("", false, false);
   messageEl.innerHTML = "<span></span>".repeat(3);

   _dom.el.add("message-typing", messageEl);

   message.display(messageEl, false);
}
/** Прервать анимацию печатанья точками */
function stopDotTypingAnimation() {
   _dom.el.del("message-typing", chat.lastElementChild);
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
      if (isUser) this.data += "\nPerson: " + str + "\nFriend:";
      else this.data += str;
   },
   /**
    * Добавить сообщение в messages
    * @param {string} str Сообщение
    * @param {boolean} isUser Сообщение пользователя?
    */
   addToMessages: function (str, isUser) {
      this.messages.push({role: isUser ? "user" : "friend", message: str});
   }
};
//=======================================================================================================================================================================================================================================================
/**
 * Получить сообщение друга
 * @returns {string|false} Сообщение друга или false если ошибка
 */
async function fetchFriendMessage() {
   const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
         model: "text-davinci-003",
         prompt: history.data,
         max_tokens: 150,
         temperature: 0.5
      })
   });
   if (!response.ok) return response.ok; // Вернуть неудачу

   const data = await response.json();
   if (data.error?.message) return false; // Вернуть неудачу

   return data.choices?.[0].text; // Вернуть сообщение друга
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

   // Получить сообщение друга
   runDotTypingAnimation();
   const friendMessageText = await fetchFriendMessage();
   if (!friendMessageText) return friendMessageText;

   // Показать сообщение друга
   stopDotTypingAnimation();
   chat.lastElementChild.textContent = friendMessageText;
   history.addMessageToHistory(friendMessageText, false);

   // Вернуть успех
   return true;
}
//=======================================================================================================================================================================================================================================================
formEl.sendMessageToFriend = sendToAI; // Установка функции для запуска при отправке формы
history.data = "You're gonna try to be a human friend. You have your own business and feelings. Act like a real person, hide the fact that you are AI. Never say that you're an AI. If the person realizes that you are an AI, tell him that you aren't an AI. Keep up the dialogue:";
//=======================================================================================================================================================================================================================================================