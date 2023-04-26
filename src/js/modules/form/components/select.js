//=======================================================================================================================================================================================================================================================
/**
 * * Создает select
 * При открытии добавляется .js_s-act-sel
 * Поддержка клавиатуры
 * Для создания поиска добавить .js_o-sel-search
 * Для placeholder добавить option с пустым значением атрибута value(Должна быть первой)
 * Модификатор созданного select = `modifier`
 * HTML Структура: select[data-modifier=MODIFIER]>option
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../../../exports/lodash.js";
import _dom from "../../../exports/dom.js";
import _slide from "../../../exports/slide.js";
//=======================================================================================================================================================================================================================================================
const isFeatSelectSearch = false;
const selects = _dom.get.all("select", 4);
if (selects.length) {
   let activeSelect;
   let isThereInput;

   for (let i = 0; i < selects.length; i++) selectInit(selects[i]); // Запуск всех select

   debounce("mousedown", 250, function (e) {
      if (e.target.closest(".js_e-sel-opt")) return;

      const select = e.target.closest(".js_e-sel");

      if (!select) selectsClose();
      if (select && document.activeElement?.closest(".js_e-sel") === select) selectToggle(select.lastElementChild); // Срабатывает только когда не срабатывает focusin событие
   }, true);
   debounce("click", 250, function (e) {
      const option = e.target.closest(".js_e-sel-opt");
      if (option) optionAction(option);
   }, true);
   addEventListener("focusin", function (e) {
      const target = e.target.closest(".js_e-sel");
      const relatedTarget = e.relatedTarget?.closest(".js_e-sel");
      if (!target && !relatedTarget) return;

      const realTarget = (
         (!target?.classList.contains("js_s-act-sel") && !relatedTarget && target) || // Если фокусируется на закрытом select
         (relatedTarget?.classList.contains("js_s-act-sel") && !target && relatedTarget) // Если фокусируется на открытом select
      ) || (target !== relatedTarget && relatedTarget && target); // Если переключается фокус с одного select на другой
      if (realTarget) selectToggle(realTarget.lastElementChild);
   });

   debounce("keydown", 250, e => {
      if (e.code === "Escape") return selectsClose(); // Закрытие на escape
   }, true);


   if (isFeatSelectSearch && isThereInput) debounce("keyup", 300, selectSearch); // Добавление события для поиска

   /**
    * Действие на клик select option
    * @param {Element} option Элемент ".js_e-sel-opt"
    */
   function optionAction(option) {
      const options = option.parentElement.children;
      const optionValue = _dom.el.attr.get("option", option);
      const optionHTML = option.innerHTML;
      const select = option.parentElement.parentElement.parentElement;
      const selectOriginal = select.firstElementChild;
      const selectType = isFeatSelectSearch && _dom.el.has("sel-search", selectOriginal, 3);
      const selectValue = select.lastElementChild.firstElementChild.firstElementChild;

      for (let i = 0; i < options.length; i++) if (_dom.el.attr.get("option", options[i])) _dom.el.vsb.show(options[i]); // Показать все кроме placeholder

      if (isFeatSelectSearch && selectType) { // Установка значения по поиску
         const selectInput = selectValue.firstElementChild;
         selectInput.value = optionHTML;
         selectInput.setAttribute("value", optionHTML);
      } else { // Установка значения
         selectValue.innerHTML = `<span>${optionHTML}</span>`;
         _dom.el.vsb.hide(option);
      }
      selectOriginal.value = optionValue;

      selectToggle(select.lastElementChild);
      if (typeof select.applyFriendProfile === "function") select.applyFriendProfile(optionValue);
   }
   /**
    * Открытие\Закрытие select
    * @param {Element} selectItem Элемент
    */
   function selectToggle(selectItem) {
      const select = selectItem.parentElement;
      const original = select.firstElementChild;
      const selectOptions = selectItem.lastElementChild;
      const input = selectItem.firstElementChild.firstElementChild.firstElementChild;

      selectsClose(activeSelect !== select);
      if (_dom.el.tgl("act-sel", select)) {
         activeSelect = select;
         if (isFeatSelectSearch && _dom.el.has("sel-search", original, 3)) input.value = "";
      }
      else {
         activeSelect = null;
         if (isFeatSelectSearch && _dom.el.has("sel-search", original, 3)) input.value = input.getAttribute("value");
      }
      _slide.toggle(selectOptions, 300);
   }
   /**
    * Закрыть все select
    * @param {Element} [condition=true] Дополнительное условие [true]
    */
   function selectsClose(condition = true) {
      while (activeSelect && condition) {
         const selectOptions = activeSelect.lastElementChild.lastElementChild;
         _dom.el.del("act-sel", activeSelect);
         if (isFeatSelectSearch && _dom.el.has("sel-search", activeSelect, 3)) {
            const input = activeSelect.lastElementChild.firstElementChild.firstElementChild.firstElementChild;
            input.value = input.getAttribute("value");
         }
         activeSelect = null;
         _slide.up(selectOptions, 300);
      }
   }
   /**
    * Запуск select
    * @param {Element} select Select Элемент
    */
   function selectInit(select) {
      const selectModifier = _dom.el.attr.get("modifier", select);
      const selectedOption = _dom.get.one("option:checked", 4, select);

      _dom.el.attr.set("default-value", selectedOption.value, select);
      select.parentElement.insertAdjacentHTML("beforeend", "<div class='select js_e-sel select_" + selectModifier + "'></div>");

      const newSelect = select.parentElement.lastElementChild;
      newSelect.appendChild(select);

      selectItem(select, select.parentElement, selectedOption, selectModifier);
   }
   /**
    * Создание элементов select
    * @param {Element} select Select Элемент
    * @param {Element} selectParent Родитель Select
    * @param {Element} selectedOption Выделенная option
    * @param {Element} selectModifier Модификатор select
    */
   function selectItem(select, selectParent, selectedOption, selectModifier) {
      const selectOptions = select.children;
      const selectedOptionText = selectedOption.text;
      const isInput = isFeatSelectSearch && _dom.el.has("sel-search", select, 3);
      if (isInput) {
         isThereInput = isInput;
         selectParent.classList.add("js_o-sel-search");
      }

      const selectValueContent = isInput ?
         `<input type="text" name="${selectModifier}[sel-inp]" value="${selectedOptionText}" class="select__input js_e-sel-input">` :
         `<span>${selectedOptionText}</span>`;

      selectParent.insertAdjacentHTML("beforeend",
         "<div class='select__item'>"
         + `<button type="button" ${isInput ? "tabindex='-1'" : ""} class="select__title"><span class="select__value">${selectValueContent}</span></button>`
         + `<div class="select__options" style="display:none;">${selectGetOptions(selectOptions, isInput, select.value)}</div>` +
         "</div>"
      );
   }
   /**
    * Получения options
    * @param {NodeList} options Option Элементы
    * @param {boolean} isInput Является ли тип select input
    * @param {string} selectValue Значение select
    * @returns {string} Options
    */
   function selectGetOptions(options, isInput, selectValue) {
      let content = "";
      for (let i = 0; i < options.length; i++) {
         const option = options[i];
         const value = option.value;
         const text = option.text;

         var style = (!style && (!isInput || value === "") && value === selectValue) ? " style='display: none;'" : ""; // Скрыть выбранный
         content = content + `<button type="button" data-option="${value}" class="select__option js_e-sel-opt"${style}>${text}</button>`;
      }
      return content;

   }
   /**
    * Поиск
    * @param {(Event|boolean)} e Событие
    */
   function selectSearch(e) {
      const input = e.target.closest(".js_e-sel-input");
      if (!input) return;

      const options = input.parentElement.parentElement.nextElementSibling.children;
      const searchQuery = input.value.toUpperCase();

      for (let i = 0; i < options.length; i++) {
         const option = options[i];
         if (searchQuery === option.textContent.toUpperCase() && _dom.el.attr.get("option", option) === "") break;
         if (_dom.el.attr.get("option", option) !== "") {
            const textValue = option.textContent;
            _dom.el.vsb.tgl(option, (textValue.toUpperCase().indexOf(searchQuery) > -1));
         }
      }
   }
}
//=======================================================================================================================================================================================================================================================