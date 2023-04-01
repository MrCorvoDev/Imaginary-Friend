//=======================================================================================================================================================================================================================================================
import _dom from "./dom.js";
import _lock from "./lock.js";
import _number from "./number.js";
//=======================================================================================================================================================================================================================================================
const debug = false && process.env.NODE_ENV === "development";
/**
 * Прокрутить до элемента
 * @async
 * @param  {Element} target Элемент
 * @returns {number} Длительность анимации(ms)
 */
async function _scrollTo(target) {
   const scrollY = window.scrollY;
   const targetOffset = _dom.el.offset(target).top;
   const durationOffset = (scrollY - targetOffset) > 0 ? (scrollY - targetOffset) : ((scrollY - targetOffset) * -1); // Если отрицательное перевести в положительное
   const DURATION_POINT = 2500; // Подобранное значение для нормальной скорости
   const duration = Math.min(2, _number.round((durationOffset / DURATION_POINT), 3)); // Длительность анимации. Максимальная длина анимации 2s

   async function animateScroll() {
      const scrollElement = window;

      const {default: gsap} = await import(/* webpackPrefetch: true */ "gsap");
      const {default: ScrollToPlugin} = await import(/* webpackPrefetch: true */ "gsap/ScrollToPlugin.js");
      gsap.registerPlugin(ScrollToPlugin);

      gsap.to(scrollElement, {
         duration: duration,
         scrollTo: targetOffset,
         ease: "power4",
      });

      if (debug) console.log("smooth", targetOffset);
   }
   if (scrollY === Math.floor(targetOffset)) {
      if (debug) console.log("тут");
      return 0;
   }
   if (debug) console.log("прокрутка");
   await animateScroll();

   return (duration * 1000); // Перевести миллисекунды
}
//=======================================================================================================================================================================================================================================================
export default _scrollTo;
//=======================================================================================================================================================================================================================================================