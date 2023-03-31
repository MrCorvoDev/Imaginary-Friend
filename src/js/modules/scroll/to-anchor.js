//=======================================================================================================================================================================================================================================================
/**
 * * Плавно прокручивает до якоря
 * Поддерживает клавиатуру и ссылку на якорь
 * Поддерживает историю (доступ - свойство `anchor`)
 * ! ID не должен начинаться с "js_e-popup-"
 * HTML Структура: a[href="ID_ELEMENT"]
 */
//=======================================================================================================================================================================================================================================================
import _is from "../../exports/is.js";
import _scrollTo from "../../exports/scroll-to.js";
import _history from "../../exports/history.js";
//=======================================================================================================================================================================================================================================================
const SELECTORS = "a[href*='#']:not([href='#'])"; // Все подходящие ссылки
let doubleClick = true; // Проверка на doubleClick

addEventListener("click", toHash);
addEventListener("popstate", toHash);
addEventListener("load", toHash);

/**
 * Прокрутка на якорь. Также предотвращение двойного клика.
 * Также если тип передаваемого события будет click тогда добавляет запись в историю.
 * При типе события popstate/load будет выключено восстановления позиции scroll браузером для перехода на якорь самим скриптом
 * @async
 * @param {Event} event Событие
 */
async function toHash(event) {
   const click = event.type === "click";
   const link = click && event.target.closest(SELECTORS);
   if (click && link && !_is.local(link.href)) return; // Проверка что ссылка ведет на туже страницу

   const target = click ? link?.hash.slice(1) : history.state?.anchor || location.hash.slice(1);
   if (!target) return;
   if (target.slice(0, 11) === "js_e-popup-") return;

   const targetElement = document.getElementById(target);
   if (!targetElement) return;
   if (click) {
      event.preventDefault();
      if (!doubleClick) return;
   }

   if (!click) history.scrollRestoration = "manual"; // Предотвращение восстановления позиции scroll браузером для того чтоб скрипт сделал это сам
   const duration = await _scrollTo(targetElement);
   if (!click) setTimeout(() => history.scrollRestoration = "auto", duration); // Разрешить восстановления позиции scroll браузером после нашего скрипта

   if (!click) return _history.hash("anchor", target);

   _history.push("anchor", target);

   doubleClick = false;
   setTimeout(() => doubleClick = true, duration);
}
//=======================================================================================================================================================================================================================================================