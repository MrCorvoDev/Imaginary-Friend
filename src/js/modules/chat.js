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
      if (this.data.slice(-8) === "\nFriend:" && isUser) this.data = this.data.slice(0, -8); // Если следующее сообщение тоже от пользователя убрать "\nFriend:"

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
   },
   save: function () {
      localStorage.setItem("messages", JSON.stringify(this.messages));
      localStorage.setItem("data", this.data);
   },
   load: function () {
      const [savedMessages, savedData] = [localStorage.getItem("messages"), localStorage.getItem("data")];
      if (!savedMessages) return;

      this.messages = JSON.parse(savedMessages);
      this.data = savedData;

      for (let i = 0; i < this.messages.length; i++) {
         const {role, message: messageText} = this.messages[i];
         const isUser = role === "user";
         const messageEl = message.create(messageText, isUser, false);

         chat.appendChild(messageEl);
         message.show(messageEl);
      }

      chat.parentElement.scrollTop = chat.parentElement.scrollHeight;
   }
};
//=======================================================================================================================================================================================================================================================
/** Abort Controller */
let controller;
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
            prompt: history.data,
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
   const friendMessage = runDotTypingAnimation();

   if (controller) controller.abort(); // Прервать предыдущий fetch
   controller = new AbortController();

   const friendMessageText = await fetchFriendMessage();
   if (friendMessageText === 0) return true; // Fetch прерван
   if (!friendMessageText) return friendMessageText;

   // Показать сообщение друга
   stopDotTypingAnimation(friendMessage);
   friendMessage.textContent = friendMessageText;
   history.addMessageToHistory(friendMessageText, false);

   // Сохранить переписку
   history.save();

   // Вернуть успех
   return true;
}
//=======================================================================================================================================================================================================================================================
formEl.sendMessageToFriend = sendToAI; // Установка функции для запуска при отправке формы
history.data = "You're gonna try to be a human friend. You have your own business and feelings. Act like a real person, hide the fact that you are AI. Never say that you're an AI. If the person realizes that you are an AI, tell him that you aren't an AI. Keep up the dialogue:";
history.load(); // Загрузить последние данные
//=======================================================================================================================================================================================================================================================