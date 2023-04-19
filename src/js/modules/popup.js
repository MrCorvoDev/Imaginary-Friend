//=======================================================================================================================================================================================================================================================
/**
 * * Создает функционал модальных окон(popup)
 * При открытии добавляется .js_s-act-popup
 * Есть возможность добавить video с YouTube путем добавление .js_e-popup-vid[data-popup-vid=VIDEO_ID"]
 * Присутствует поддержка истории браузера(для приватного popup добавить .js_o-popup-priv), открытия по ссылке, закрытие на ESC клавишу
 * HTML Структура:
 * ---> Popups: #js_e-popups>[id="ID_POPUP"]>ANY>.js_e-popup-bd
 * ---> Ссылка открытия: a[href="ID_POPUP"]
 * ---> Элемент видео(внутри .js_e-popup-bd)(опционально): .js_e-popup-vid
 * ---> Элемент закрытия(внутри .js_e-popup-bd)(опционально): .js_e-close-popup или все что снаружи .js_e-popup-bd
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../exports/lodash.js";
import _history from "../exports/history.js";
import _lock from "../exports/lock.js";
import _dom from "../exports/dom.js";
//=======================================================================================================================================================================================================================================================
const isFeat = {
   video: true,
   private: true,
};
/**
 * Родитель всех popup
 * @type {Element}
 */
const popupParent = _dom.get.one("popups", 2);
/**
 * Живая коллекция открытых popup
 * @type {Element}
 */
let activePopup;
/**
 * Объект со всеми popup
 * Popups : Объект
 * ---> Имя Popup : Массив
 * ------> Элемент popup
 * ------> Элемент .js_e-popup-vid
 * @type {Array<Element>}
 */
const popups = {};
/**
 * Живая коллекция popups
 * @type {HTMLCollection}
 */
const popupsHTMLCollection = popupParent.children;
for (let i = 0; i < popupsHTMLCollection.length; i++) {
   const popup = popupsHTMLCollection[i];
   popup.closeThisPopup = () => closePopup(popup);
   const name = popup.id;
   const video = isFeat.video && _dom.get.one("popup-vid", 1, popup);
   popups[name] = [popup, video];
}
//=======================================================================================================================================================================================================================================================
/** Открывает\закрывает popup */
function actionPopup() {
   if (_lock.is) return;

   const name = history.state?.popup || location.hash.slice(1);
   const currentPopup = (name?.slice(0, 11) === "js_e-popup-") && popups[name]?.[0];

   if (currentPopup) {
      const video = isFeat.video && popups[name][1];
      openPopup(currentPopup, video);
   } else if (activePopup) closePopup(activePopup, false);
}
/**
 * Открыть popup
 * @param {Element} item Popup
 * @param {string} [video] Youtube ID видео
 */
function openPopup(item, video) {
   if (activePopup) closePopup(activePopup, false, false); // Закрытие активного popup

   if (_lock.is) return;

   if (isFeat.video && video) video.innerHTML = "<iframe src='https://www.youtube.com/embed/" + _dom.el.attr.get("popup-vid", video) + "?autoplay=1' allow='autoplay; encrypted-media' allowfullscreen></iframe>"; // Вставка видео

   _lock.add(500);

   _dom.el.add("act-popup", item);
   activePopup = item;

   const isPrivate = isFeat.private && _dom.el.has("popup-priv", item, 3);

   _history.hash("popup", item.id, isPrivate);
}
/**
 * Закрыть popup
 * @param {Element} item Popup
 * @param {boolean} [isHistory=true] Добавлять ли запись в историю [true]
 * @param {boolean} [bodyUnlock=true] Блокирован ли scroll основного контента [true]
 */
function closePopup(item, isHistory = true, bodyUnlock = true) {
   if (_lock.is) return;

   const name = item.id;
   const video = isFeat.video && popups[name][1];
   if (isFeat.video && video) video.innerHTML = ""; // Удаление видео(фикс бага)

   _dom.el.del("act-popup", item);
   activePopup = null;

   if (bodyUnlock) _lock.remove(500);

   const isPrivate = isFeat.private && _dom.el.has("popup-priv", item, 3);
   _history.push("popup", "", (!isPrivate && isHistory));
}
//=======================================================================================================================================================================================================================================================
const CLOSE_DELAY = 1000;
debounce("click", CLOSE_DELAY, function (e) {
   if (e.target.closest(".js_e-popup-bd") && !e.target.closest(".js_e-popup .js_e-close-popup")) return;

   closePopup(e.target.closest(".js_e-popup"));
}, true, popupParent);
debounce("keydown", CLOSE_DELAY, e => (e.code === "Escape") && activePopup && closePopup(activePopup), true); // Закрытие при клике на esc

addEventListener("load", actionPopup);
addEventListener("popstate", actionPopup);

if (!localStorage.getItem("isConfigurated")) { // Не показывать повторно
   openPopup(popups["js_e-popup-setup"][0]);
   localStorage.setItem("isConfigurated", true);
}
//=======================================================================================================================================================================================================================================================