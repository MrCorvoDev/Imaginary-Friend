//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал quantity
 * HTML Структура: .js_e-quant[data-quant="+"]+input+.js_e-quant[data-quant="-"]
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../../../exports/dom.js";
import {debounce} from "../../../exports/lodash.js";
//=======================================================================================================================================================================================================================================================
debounce("click", 150, function (event) {
   const button = event.target.closest(".js_e-quant");
   if (!button) return;

   const input = button.nextElementSibling || button.previousElementSibling;
   let value = +input.value;

   const isPlusButton = _dom.el.attr.get("quant", button) === "+";
   if (!isPlusButton && value === 1) return;

   if (isPlusButton) value++;
   if (!isPlusButton) value--;

   input.value = value;
}, true);
//=======================================================================================================================================================================================================================================================