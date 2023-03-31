//=======================================================================================================================================================================================================================================================
/**
 * * Добавляет класс при прокручивании
 * Использует GSAP ScrollTrigger
 * При активации блока добавляется .js_s-act-st-anim
 * При активации ссылки добавляется .js_s-act-st-lh
 * Добавить .js_o-st-anim-hide для удаление класса после прокручивания элемента
 * ! Один блок - одна ссылка
 * HTML Структура:
 * ---> Блоки: [id=SAME_ID].js_e-st
 * ------> Анимация блока(опционально): .js_e-st-anim
 * ------> Подсветка ссылок(опционально): .js_e-st-lh
 * ---> Ссылки: MENU>LAST_CHILD>LAST_CHILD>ELEMENT>a[href=SAME_ID]
 */
//=======================================================================================================================================================================================================================================================
import _dom from "../../exports/dom.js";
import _header from "../../exports/header.js";
//=======================================================================================================================================================================================================================================================
const isFeat = {
   blockAnimation: true,
   linkHighlight: true,
};
const gsapItems = _dom.get.all("st"); // Общий элемент для gsap
(async () => {
   const {default: gsap} = await import(/* webpackPreload: true */ "gsap");
   const {default: ScrollTrigger} = await import(/* webpackPreload: true */ "gsap/ScrollTrigger.js");
   gsap.registerPlugin(ScrollTrigger);

   const tl = gsap.timeline(); // Общий timeline
   setTimeout(() => {
      for (let i = 0; i < gsapItems.length; i++) {
         const gsapItem = gsapItems[i];
         if (isFeat.blockAnimation && _dom.el.has("st-anim", gsapItem, 1)) {
            let animHeight = gsapItem.offsetHeight;
            let animPoint = (animHeight > innerHeight) ? (innerHeight / 100) * 40 : (animHeight / 100) * 40;
            ScrollTrigger.create({
               animation: tl,
               trigger: gsapItem,
               start: () => `${animPoint}px bottom`,
               end: () => `${animHeight - animPoint}px ${_header.h + 2}px`,
               preventOverlaps: "scroll-trigger", // Заканчивает предыдущие анимации
               fastScrollEnd: true, // Если область анимации была прокручена быстрее чем 2500px/s тогда немедленно завершить анимацию
               onToggle: self => {
                  if (self.isActive) return _dom.el.add("act-st-anim", gsapItem);
                  if (_dom.el.has("st-anim-hide", gsapItem, 3)) return _dom.el.del("act-st-anim", gsapItem);
               },
               onRefresh: () => {
                  animHeight = gsapItem.offsetHeight;
                  animPoint = (animHeight > innerHeight) ? (innerHeight / 100) * 40 : (animHeight / 100) * 40;
               },
               // markers: true,
            });
         }
         if (isFeat.linkHighlight && _dom.el.has("st-lh", gsapItem, 1)) {
            const link = _dom.get.one(`a[href="#${gsapItem.getAttribute("id")}"]`, 4, _header.menuBD.lastElementChild);
            ScrollTrigger.create({
               animation: tl,
               trigger: gsapItem,
               start: () => `top ${_header.h + 2}px`,
               end: () => `bottom ${_header.h + 2}px`,
               toggleClass: {targets: link, className: "js_s-act-st-lh"},
               preventOverlaps: "scroll-trigger", // Заканчивает предыдущие анимации
               fastScrollEnd: true, // Если область анимации была прокручена быстрее чем 2500px/s тогда немедленно завершить анимацию
               // markers: true,
            });
         }
      }
   }, 300);
})();
//=======================================================================================================================================================================================================================================================