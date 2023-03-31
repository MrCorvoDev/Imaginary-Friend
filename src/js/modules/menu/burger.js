//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал menu(burger)
 * При открытии добавляется .js_s-act-menu
 * Также элемент для закрытия меню: .js_e-menu-close
 * HTML Структура: #js_e-header>*>MENU>.js_e-burger
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../../exports/lodash.js";
import _header from "../../exports/header.js";
import _is from "../../exports/is.js";
import _lock from "../../exports/lock.js";
import _dom from "../../exports/dom.js";
import _mediaQuery from "../../exports/media-query.js";
//=======================================================================================================================================================================================================================================================
const burger = _header.menuBD.previousElementSibling;
const debug = false && process.env.NODE_ENV === "development";
debounce("click", 500, function (e) {
   if (!e.target.closest(".js_e-menu-close, .js_e-burger")) return;

   toggleMenu();

   if (debug) console.log("Toggle menu", e.type);
}, true);
addEventListener("focusout", function (e) {
   if (_is.hide(burger)) return;
   if (!_dom.el.has("act-menu", _header.menu)) return;

   if (!e.target.closest("#js_e-header")) return; // Если шапка теряет фокус продолжить
   if (!e.relatedTarget) return; // Если фокус получает нечего остановить
   if (e.relatedTarget?.closest("#js_e-header")) return; // Если фокус получает другой элемент на странице продолжить

   toggleMenu();

   if (debug) console.log("Closing menu", e.type);
});
_mediaQuery.handler(md => {
   if (md.matches) return;
   if (!_is.hide(burger)) return;
   if (!_dom.el.has("act-menu", _header.menu)) return;

   toggleMenu();

   if (debug) console.log("Closing menu");
});

/** Открыть\Закрыть меню */
function toggleMenu() {
   if (_lock.is) return;

   _lock.toggle(500);
   _dom.el.tgl("act-menu", _header.menu);
}
//=======================================================================================================================================================================================================================================================