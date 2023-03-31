//=======================================================================================================================================================================================================================================================
/**
 * * Создает полно-экранный вертикальный слайдер
 * ! При инициализации выключить to-anchor из-за конфликта с ссылками
 * ! Только одна ссылка на один слайд
 * При активации ссылки добавляется .js_s-act-fs (к ссылке)
 * При получении swiper FreeMode добавляется .js_s-free-fs
 * HTML Структура:
 * ---> Swiper: (#js_e-fs>(.swiper-wrapper>.swiper-slide[id="SAME_ID"])+.swiper-pagination)+.swiper-scrollbar
 * ---> Ссылки: MENU>LAST_CHILD>LAST_CHILD>ELEMENT>a.js_e-fs-link[href="#SAME_ID"]
 */
//=======================================================================================================================================================================================================================================================
import {debounce} from "../../exports/lodash.js";
import _header from "../../exports/header.js";
import _lock from "../../exports/lock.js";
import _dom from "../../exports/dom.js";
//=======================================================================================================================================================================================================================================================
const isFeatLinkHighlighting = true;
const FS_SELECTOR = "#js_e-fs";
const fs = _dom.get.one("fs", 2);
const slides = fs.firstElementChild.children;
const links = isFeatLinkHighlighting && _dom.get.all("fs-link", 1, _header.menuBD.lastElementChild);
const slideItems = {};
let activeLink;
let pageSlider;
if (isFeatLinkHighlighting) for (let i = 0; i < slides.length; i++) {
   const slide = slides[i];
   const currentLink = Array.from(links).find(link => `#${slide.id}` === link.hash);

   slideItems[currentLink.hash] = [i, currentLink];
}
const sliderParams = {
   init: false,
   direction: "vertical",
   slidesPerView: "auto",
   keyboard: {
      enabled: true,
   },
   mousewheel: {
      sensitivity: 1,
   },
   pagination: {
      el: `${FS_SELECTOR} .swiper-pagination`,
      clickable: true,
   },
   scrollbar: {
      el: `${FS_SELECTOR}+.swiper-scrollbar`,
      draggable: true
   },
   on: {
      init: function () {
         debounce("resize", 500, setScrollType);
         initLinks();
         for (let i = 0; i < slides.length; i++) {  // Отслеживание изменения высоты слайдов после инициализации
            new ResizeObserver(async entries => {
               for (const entry of entries) (entry.contentBoxSize) && await setScrollType(true);
            }).observe(slides[i]);
         }
      },
      slideChange: setCurrentLinkAsActive,
   },
};
/** Установить текущую ссылку(привязанную к слайду) как активную */
function setCurrentLinkAsActive() {
   if (activeLink) _dom.el.del("act-fs", activeLink);
   activeLink = slideItems[`#${slides[pageSlider.realIndex].id}`][1];
   _dom.el.add("act-fs", activeLink);
}
/** Отслеживание клика на ссылки */
function initLinks() {
   if (isFeatLinkHighlighting) setCurrentLinkAsActive();
   addEventListener("click", e => {
      const link = e.target.closest(".js_e-fs-link");
      if (!link) return;

      e.preventDefault();
      pageSlider.slideTo(slideItems[link.hash][0], 800);
      if (link.closest("header") && !_lock.is && _dom.el.has("act-menu", _header.menu)) { // Закрытие меню если открыто
         _lock.remove(500);
         _dom.el.del("act-menu", _header.menu);
      }
   });
}
/**
 * Определение типа scroll (Если контент выше экрана то включить freeMode)
 * @async
 * @param {boolean} observer Отслеживание изменения размера слайдов
 */
async function setScrollType(observer) {
   const isModeChange = sliderParams.freeMode;
   if (observer && _dom.el.has("free-fs", fs)) {
      _dom.el.del("free-fs", fs);
      sliderParams.freeMode = Boolean(0);
   }
   for (let i = 0; i < slides.length; i++) {
      const pageSlideContentHeight = slides[i]?.offsetHeight;
      if (pageSlideContentHeight && pageSlideContentHeight > ((_dom.el.has("lp", _header.self, 1) && (innerHeight - _header.h)) || innerHeight)) {
         _dom.el.add("free-fs", fs);
         sliderParams.freeMode = Boolean(1);
         break;
      }
   }
   if (observer && (isModeChange !== sliderParams.freeMode)) await init();
}
/** Запуск */
async function init() {
   if (pageSlider) {
      var activeSlide = pageSlider.realIndex;
      pageSlider.destroy();
   } else await setScrollType();
   const {default: Swiper} = await import(/* webpackPreload: true */ "swiper");
   pageSlider = new Swiper(fs, sliderParams);
   pageSlider.init();
   if (activeSlide) pageSlider.slideTo(activeSlide, 0);
}
init();
//=======================================================================================================================================================================================================================================================