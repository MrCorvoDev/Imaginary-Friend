//=======================================================================================================================================================================================================================================================
/**
 * * Установка "true placeholder"
 * Поддерживает Клавиатуру
 * HTML Структура:
 * ---> Функционал ввода формы(фокус и т.д.): .js_e-input
 * ---> placeholder: [data-placeholder]
 * ---> Пароль(требует выключения): [data-type=pass]
 * ---> Выбор даты: input.js_e-datepicker
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../../exports/dom.js";
import _form from "../../exports/form.js";
//=======================================================================================================================================================================================================================================================
const inputs = _dom.get.all("placeholder", 2);
const isFeat = {
   datepicker: true,
   password: true,
};
for (let i = 0; i < inputs.length; i++) {
   const input = inputs[i];
   const inputPlaceholder = _dom.el.attr.get("placeholder", input);

   if (!input.value && inputPlaceholder) input.value = inputPlaceholder; // Установка placeholder
}

addEventListener("focusin", function (e) {
   const input = e.target.closest(".js_e-input");
   if (!input) return;

   _form.foc.add(input);
   _form.err.remove(input);

   if (isFeat.datepicker && _dom.el.attr.get("datepicker", input) === "item") {
      const picker = input.datepicker;
      const inputs = picker.rangepicker.inputs;
      const neighbor = (inputs[0] === input) ? inputs[1] : inputs[0];

      _form.err.remove(neighbor);
   }


   if (!_dom.el.has("placeholder", input, 4)) return;

   if (isFeat.password && _dom.el.attr.get("type", input) === "pass") input.setAttribute("type", "password"); // Скрытие пароля
   if (input.value === _dom.el.attr.get("placeholder", input)) input.value = ""; // Удаление placeholder
});
addEventListener("focusout", function (e) {
   const input = e.target.closest(".js_e-input");
   if (!input) return;

   _form.foc.remove(input);

   if (!_dom.el.has("placeholder", input, 4)) return;
   if (input.value) return;

   input.value = _dom.el.attr.get("placeholder", input); // Установка placeholder
   if (isFeat.datepicker && _dom.el.attr.get("datepicker", input) === "item") {
      const picker = input.datepicker;
      const inputs = picker.rangepicker.inputs;
      const neighbor = (inputs[0] === input) ? inputs[1] : inputs[0];

      neighbor.value = _dom.el.attr.get("placeholder", neighbor); // Установка placeholder
   }
   if (isFeat.password && _dom.el.attr.get("type", input) === "pass") input.setAttribute("type", "text"); // Показ placeholder если [data-type] = pass
});
//=======================================================================================================================================================================================================================================================