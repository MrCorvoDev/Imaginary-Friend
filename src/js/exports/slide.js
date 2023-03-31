//=======================================================================================================================================================================================================================================================
import _dom from "./dom.js";
import _is from "./is.js";
//=======================================================================================================================================================================================================================================================
/**
 * Управление слайдом
 * @namespace
 * @property {Function} up {@link _slide.up} Скрыть слайдом
 * @property {Function} down {@link _slide.down} Показать слайдом
 * @property {Function} toggle {@link _slide.toggle} Скрыть/Показать слайдом
 */
const _slide = {};
/**
 * Скрыть слайдом
 * @param {Element} target Элемент
 * @param {number} [duration=500] Скорость анимации [500]
 * @param {number} [showMoreHeight=0] Высота showMore [0]
 */
_slide.up = function (target, duration = 500, showMoreHeight = 0) {
   clearTimeout(target.slideAnimationTimeoutID);

   _dom.el.add("slide", target);
   target.style.transitionProperty = "height, margin, padding";
   target.style.transitionDuration = duration + "ms";
   target.style.height = `${target.offsetHeight}px`;
   target.offsetHeight;
   target.style.overflow = "hidden";
   target.style.height = showMoreHeight ? `${showMoreHeight}px` : "0px";
   target.style.paddingTop = 0;
   target.style.paddingBottom = 0;
   target.style.marginTop = 0;
   target.style.marginBottom = 0;
   target.slideAnimationTimeoutID = setTimeout(() => {
      _dom.el.vsb.tgl(target, showMoreHeight);
      !showMoreHeight ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showMoreHeight ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      _dom.el.del("slide", target);
   }, duration);

};
/**
 * Показать слайдом
 * @param {Element} target Элемент
 * @param {number} [duration=500] Скорость анимации [500]
 * @param {number} [showMoreHeight=0] Высота showMore [0]
 */
_slide.down = function (target, duration = 500, showMoreHeight = 0) {
   clearTimeout(target.slideAnimationTimeoutID);

   _dom.el.add("slide", target);
   _is.hide(target) ? _dom.el.vsb.show(target) : null;
   showMoreHeight ? target.style.removeProperty("height") : null;
   const height = target.offsetHeight;
   target.style.overflow = "hidden";
   target.style.height = showMoreHeight ? `${showMoreHeight}px` : "0px";
   target.style.paddingTop = 0;
   target.style.paddingBottom = 0;
   target.style.marginTop = 0;
   target.style.marginBottom = 0;
   target.offsetHeight;
   target.style.transitionProperty = "height, margin, padding";
   target.style.transitionDuration = duration + "ms";
   target.style.height = height + "px";
   target.style.removeProperty("padding-top");
   target.style.removeProperty("padding-bottom");
   target.style.removeProperty("margin-top");
   target.style.removeProperty("margin-bottom");
   target.slideAnimationTimeoutID = setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      _dom.el.del("slide", target);
   }, duration);

};
/**
 * Скрыть/Показать слайдом
 * (Проверяет скрыт ли элемент и вызывает подфункции)
 * @param {Element} target Элемент
 * @param {number} [duration=500] Скорость анимации [500]
 */
_slide.toggle = (target, duration = 500) => (_is.hide(target)) ? _slide.down(target, duration) : _slide.up(target, duration);
//=======================================================================================================================================================================================================================================================
export default _slide;
//=======================================================================================================================================================================================================================================================