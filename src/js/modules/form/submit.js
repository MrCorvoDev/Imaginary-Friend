//=======================================================================================================================================================================================================================================================
/**
 * * Правильно отправляет форму(с валидацией и последующей очисткой)
 * ! Дополнительные функции требуют включения
 * Поддерживает AJAX
 * При валидации если найден элемент с ошибкой валидации то окно прокрутит к нему если его не видно хотя бы на 50%
 * При отправке формы добавляется .js_s-send
 * Если отправке была успешная или нет показывается уведомление
 * HTML Структура:
 * ---> Форма: form[action method]
 * ------> Локация после отправки(опционально): [data-submit-location] (требует включения)
 * ---> Элементы валидации: .js_e-req
 *
 * Дополнительный функционал:
 * ---> Выборочно обязательный input: [data-req="GROUP NAME"]
 * ---> Перемещение данных в другую форму: [data-move-value="FORM'S_ID, ELEMENT'S_NAME_ATTRIBUTE"]
 * ---> Проверка email: [data-type="email"]
 * ---> Пароль: [data-type="pass"]
 * ---> Подтверждения input: [data-confirm-input="SELECTOR_OF_THE_TEST_ELEMENT(MAIN_ELEMENT)"]
 * ---> Checkbox: input[type="checkbox"]
 * ---> Интернациональный телефон: input.js_e-intl-tel
 * ---> Маски на ввод: input.js_e-imask[data-imask="TYPE"]
 * ---> Загрузка изображения: js_e-upload-img
 * ---> Range: #js_e-rng
 * ---> Выбор даты: input.js_e-datepicker
 * ---> Autosize Textarea: .js_e-autosize
 * ---> Select: select[data-modifier=MODIFIER]>option
 */
//=======================================================================================================================================================================================================================================================
import _is from "../../exports/is.js";
import _scrollTo from "../../exports/scroll-to.js";
import _form from "../../exports/form.js";
import _dom from "../../exports/dom.js";
//=======================================================================================================================================================================================================================================================
const isFeat = {
   intlPhone: true,
   inputMove: true,
   nextLocation: true,
   reqGroups: true,
   email: true,
   checkbox: true,
   confirmInput: true,
   imask: true,
   file: true,
   range: true,
   datepicker: true,
   autosize: true,
   password: true,
   select: true,
   selectSearch: true,
};
const forms = document.forms;
const debug = false && process.env.NODE_ENV === "development";
/* global intlTelInputGlobals */
if (forms.length) {
   addEventListener("submit", submit);
   addEventListener("keydown", async e => { // Отправка по Enter
      if (e.target.tagName !== "TEXTAREA") return;
      if (e.code !== "Enter") return;

      e.preventDefault();

      setTimeout(() => e.target.value = "", 0); // Очистить textarea сразу после того как запуститься `submit`
      await submit({target: e.target.form, preventDefault: () => {}});
   });

   /**
    * Отправить форму
    * @async
    * @param {Event} e Событие
    */
   async function submit(e) {
      e.preventDefault();

      const form = e.target;
      if (_dom.el.has("send", form) && form.id !== "js_e-form-message") return; // Разрешить отправлять повторно если это js_e-form-message форма

      const validArray = await validate(form);
      const isValid = validArray[0];
      const someData = validArray[1];

      if (!isValid) return;

      const nextLocation = isFeat.nextLocation && _dom.el.attr.get("submit-location", form); // Путь который будет открыт после отправки формы
      const action = form.getAttribute("action");
      const method = form.getAttribute("method");
      const data = new FormData(form);

      if (isFeat.intlPhone && someData.intlPhone) for (let i = 0; i < someData.intlPhone.length; i++) {
         const element = someData.intlPhone[i];
         const name = element.getAttribute("name");
         const realValue = intlTelInputGlobals.getInstance(element).getNumber();

         data.set(name, realValue);
      }
      if (isFeat.inputMove && someData.inputMove) {
         const formsObject = {};
         for (let i = 0; i < someData.inputMove.length; i++) {
            const array = someData.inputMove[i];
            const formId = array[0];
            const inputName = array[1];
            const value = array[2];

            if (!formsObject[formId]) for (let i = 0; i < forms.length; i++) {
               const form = forms[i];
               formsObject[form.id] ??= form;
            }

            const targetForm = formsObject[formId];
            const targetInput = Array.from(targetForm.elements).find(element => element.getAttribute("name") === inputName);

            targetInput.value = value;
         }
      }

      if (debug) for (const el of data.entries()) console.log(el[0], el[1]);

      _dom.el.add("send", form);

      const {default: alertify} = await import(/* webpackPrefetch: true */ "alertifyjs");

      if (form.id === "js_e-form-message") {
         if (document.activeElement !== form.elements[0]) await clear(form);

         const response = await form.sendMessageToFriend(data.get(form.elements[0].name));
         if (!response) alertify.notify("Sending is failed", "error");
      } else if (form.id === "js_e-form-profiles") {
         await clear(form);
         const messageArray = form.saveThisFriendProfile(data.get(form.elements[0].name));
         if (messageArray) alertify.notify(...messageArray);
      } else if (form.id === "js_e-form-setup") {
         form.setupThisFriendConfig(data);
      } else {
         const response = action === "#" ? {ok: true} : (await fetch(action, {method: method, body: data})); // Отправка
         if (response.ok) { // Проверить что форма отправилась успешно
            await clear(form);
            if (form.id === "js_e-form-api") localStorage.setItem("isApiKnown", true);
            if (nextLocation) location.assign(nextLocation);
            else alertify.notify("Sending is successful", "success");
         } else alertify.notify("Sending is failed", "error");
      }

      _dom.el.del("send", form);
   }
   /**
    * Проверка на валидность элементов формы
    * @async
    * @param {HTMLFormElement} form Форма
    * @returns {Array<boolean, object>} [валидный ли, {какие-то данные}]
    */
   async function validate(form) {
      let isValid = true;
      const someData = {};
      const reqGroups = {}; // Группы выборочных требуемых элементов
      let isReqGroupsValid; // Есть ли валидный элемент в группах(Нужно для избежания ненужных циклов)
      let reqGroupErrorTarget; // Цель ошибки(Для установки верной цели)

      const elements = form.elements;
      for (let i = 0; i < elements.length; i++) {
         const element = elements[i];

         if (_dom.el.has("req", element, 1)) {
            const isElementValid = validateElement(element);

            if (isFeat.reqGroups && _dom.el.has("req", element, 4)) {
               const group = _dom.el.attr.get("req", element); // Имя группы

               if (isElementValid) isReqGroupsValid = true; // В Req Groups есть валидный элемент
               else if (typeof isReqGroupsValid === "undefined") isReqGroupsValid = false; // Установить явное false

               if (!reqGroups[group]) reqGroups[group] = [isElementValid, [element]]; // Если группа еще не создана
               else { // Если группа уже создана
                  if (isElementValid) reqGroups[group][0] = isElementValid;
                  reqGroups[group][1].push(element);
               }
               if (isValid && !isElementValid && !errorTarget) { // Получить первый элемент который не прошел проверку
                  var errorTarget = element;
                  reqGroupErrorTarget = element; // Установить как первый Req Group элемент который невалиден
               }
            } else {
               isValid = isValid && isElementValid; // Установить статус формы
               if (!isValid && (!errorTarget || _dom.el.has("req", errorTarget, 4))) var errorTarget = element; // Получить первый элемент который не прошел проверку или перезаписать Req Group элемент(потому что не известно, возможно он валиден)
            }
         }
         if (isFeat.intlPhone && _dom.el.has("intl-tel", element, 1)) {
            someData.intlPhone ??= [];

            someData.intlPhone.push(element);
         }
         if (isFeat.inputMove && _dom.el.has("move-value", element, 4)) {
            someData.inputMove ??= [];
            const settings = _dom.el.attr.get("move-value", element).split(",");
            const formId = settings[0].trim();
            const inputName = settings[1].trim();
            const result = [formId, inputName, element.value];

            someData.inputMove.push(result);
         }
      }

      if (isFeat.reqGroups) {
         if (typeof isReqGroupsValid !== "undefined" && !isReqGroupsValid) isValid = false; // Установить статус формы
         const reqGroupNames = reqGroups && Object.keys(reqGroups); // Создание массива имен групп
         for (let i = 0; i < reqGroupNames.length; i++) {
            const name = reqGroupNames[i]; // Имя Группы
            const isGroupValid = reqGroups[name][0]; // Валидна ли группа
            const groupElements = reqGroups[name][1]; // Элементы группы
            if (isGroupValid) for (let i = 0; i < groupElements.length; i++) _form.err.remove(groupElements[i]); // Если валидная то удалить состояние ошибки
            else { // Если не валидна
               isValid = false; // Установить статус формы
               if (reqGroupErrorTarget && _dom.el.attr.get("req", reqGroupErrorTarget) === name) errorTarget = reqGroupErrorTarget; // Восстановить цель ошибки если до этого она была Req Group Элементов
            }
         }
      }

      if (!isValid && !_is.seen(errorTarget, 50)) await _scrollTo(errorTarget); // Прокрутить до элемента который не прошел проверку

      return [isValid, someData];

      /**
       * Проверить элемента
       * @param {Element} input Элемент формы
       * @returns {boolean} Валидный ли
       */
      function validateElement(input) { // Проверить элемента
         let isValid = true;

         if (
            (isFeat.email && _dom.el.attr.get("type", input) === "email" && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/.test(input.value)) ||
            (isFeat.checkbox && input.getAttribute("type") === "checkbox" && !input.checked) ||
            (isFeat.confirmInput && _dom.el.has("confirm-input", input, 4) && (_dom.get.one(_dom.el.attr.get("confirm-input", input), 4, input.closest("form")).value !== input.value)) ||
            (isFeat.imask && _dom.el.has("imask", input, 1) && !input.inputmask.isComplete()) ||
            (isFeat.intlPhone && _dom.el.has("intl-tel", input, 1) && !intlTelInputGlobals.getInstance(input).isValidNumber()) ||
            (isFeat.select && input.tagName === "SELECT" && !input.value && !_form.err.add(input.parentElement)) ||
            (!input.value || input.value === _dom.el.attr.get("placeholder", input))
         ) {
            _form.err.add(input);
            isValid = false;
            return isValid;
         }

         _form.err.remove(input);
         return isValid;
      }
   }
   /**
    * Очистка формы
    * @async
    * @param {HTMLFormElement} form Форма
    */
   async function clear(form) {
      form.reset(); // Нативная функция очистки

      const elements = form.elements;
      for (let i = 0; i < elements.length; i++) {
         const element = elements[i];
         const type = element.getAttribute("type");


         if (isFeat.file && type === "file" && _dom.el.has("upload-img", element, 1)) {
            element.parentElement.nextElementSibling.innerHTML = "";
         }
         if (isFeat.range && _dom.el.has("rng-from", element, 1)) {
            element.parentElement.nextElementSibling.noUiSlider.reset();
         }
         if (isFeat.datepicker && _dom.el.has("datepicker", element, 1)) {
            const hasRange = _dom.el.has("datepicker", element, 4);

            (!hasRange) ? element.datepicker.setDate({clear: true}) : element.datepicker.rangepicker.setDates({clear: true});
         }
         if (isFeat.autosize && _dom.el.has("autosize", element, 1)) {
            const {default: autosize} = await import(/* webpackPrefetch: true */ "autosize");
            autosize.update(element);
         }

         if (_dom.el.has("input", element, 1)) {
            _form.foc.remove(element);

            if (_dom.el.has("placeholder", element, 4)) {
               element.value = _dom.el.attr.get("placeholder", element);

               if (isFeat.datepicker && _dom.el.attr.get("datepicker", element) === "item") {
                  const picker = element.datepicker;
                  const inputs = picker.rangepicker.inputs;
                  const neighbor = (inputs[0] === element) ? inputs[1] : inputs[0];

                  neighbor.value = _dom.el.attr.get("placeholder", neighbor); // Установка placeholder
               }
               if (isFeat.password && type === "password") element.setAttribute("type", "text");
            }
         }
      }

      if (isFeat.select) {
         const selects = _dom.get.all("sel", 1, form);
         for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            const selectItem = select.lastElementChild;
            const selectTitle = selectItem.firstElementChild.firstElementChild;
            const selectOriginal = select.firstElementChild;
            const selectModifier = _dom.el.attr.get("modifier", selectOriginal);
            const isInput = isFeat.selectSearch && _dom.el.has("sel-search", selectOriginal, 3);
            const selectDefaultValue = _dom.el.attr.get("default-value", selectOriginal);
            const selectOptions = selectItem.lastElementChild.children;

            for (let i = 0; i < selectOptions.length; i++) { // Установка значения по умолчанию
               const option = selectOptions[i];
               const optionValue = _dom.el.attr.get("option", option);
               if (optionValue === selectDefaultValue) {
                  if (!isInput) _dom.el.vsb.hide(option);
                  const selectedOptionText = option.textContent;
                  const selectValueContent = isInput ?
                     `<input type="text" name="${selectModifier}[sel-inp]" value="${selectedOptionText}" class="select__input js_e-sel-input">` :
                     `<span>${selectedOptionText}</span>`;

                  selectTitle.innerHTML = selectValueContent;
               } else _dom.el.vsb.show(option);
            }
         }
      }
   }
}
//=======================================================================================================================================================================================================================================================