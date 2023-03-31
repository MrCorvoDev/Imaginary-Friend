//=======================================================================================================================================================================================================================================================
import _dom from "./dom.js";
import _header from "./header.js";
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
   const isHeaderLockPadding = _dom.el.has("lp", _header.self, 1);
   const isOutsideMenu = !target.closest(".js_e-menu-bd");
   const scrollY = isOutsideMenu ? window.scrollY : _header.menuBD.scrollTop;
   if (!_lock.is && _dom.el.has("act-menu", _header.menu) && isOutsideMenu) {
      _lock.remove(500);
      _dom.el.del("act-menu", _header.menu);
   }

   const targetOffset = _dom.el.offset(target, !isOutsideMenu && _header.menuBD).top;
   const durationOffset = (scrollY - targetOffset) > 0 ? (scrollY - targetOffset) : ((scrollY - targetOffset) * -1); // Если отрицательное перевести в положительное
   const DURATION_POINT = 2500; // Подобранное значение для нормальной скорости
   const duration = Math.min(2, _number.round((durationOffset / DURATION_POINT), 3)); // Длительность анимации. Максимальная длина анимации 2s

   async function animateScroll(hType) {
      const scrollElement = isOutsideMenu ? window : _header.menuBD;
      if (!isOutsideMenu) hType = _dom.el.has("sticky") ? _header.sh : _header.h;

      const {default: gsap} = await import(/* webpackPrefetch: true */ "gsap");
      const {default: ScrollToPlugin} = await import(/* webpackPrefetch: true */ "gsap/ScrollToPlugin.js");
      gsap.registerPlugin(ScrollToPlugin);

      gsap.to(scrollElement, {
         duration: duration,
         scrollTo: targetOffset - (hType || 0),
         ease: "power4",
         onStart: function () {
            if (!hType) return;

            _header.stk = false;
            (hType === _header.sh) ? _dom.el.add("sticky") : _dom.el.del("sticky");
         },
         onComplete: function () {
            if (!hType) return;

            setTimeout(() => _header.stk = true, 650);
         },
      });

      if (debug) console.log("smooth", targetOffset, hType);
   }
   if ((!isHeaderLockPadding && scrollY === Math.floor(targetOffset)) || (!_dom.el.has("sticky") && scrollY === Math.floor(targetOffset - _header.h)) || (scrollY === Math.floor(targetOffset - _header.sh))) {
      if (debug) console.log("тут");
      return 0;
   }
   if (isHeaderLockPadding && ((scrollY + _header.sh > targetOffset && !_dom.el.has("vh", target, 1)) || (_dom.el.has("vh", target, 4) && _dom.el.attr.get("vh", target).indexOf("headerH") !== -1))) {
      if (debug) console.log("выше");
      await animateScroll(_header.h);
   } else if (isHeaderLockPadding) {
      if (debug) console.log("ниже");
      await animateScroll(_header.sh);
   } else {
      if (debug) console.log("без");
      await animateScroll();
   }
   return (duration * 1000); // Перевести миллисекунды
}
//=======================================================================================================================================================================================================================================================
export default _scrollTo;
//=======================================================================================================================================================================================================================================================