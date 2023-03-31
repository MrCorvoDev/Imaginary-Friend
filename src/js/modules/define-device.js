//=======================================================================================================================================================================================================================================================
/** Определяет тип устройства(сенсор или мышь) и добавляет соответствующий класс к body и определяет переменную */
//=======================================================================================================================================================================================================================================================
import _dom from "../exports/dom.js";
import _is from "../exports/is.js";
//=======================================================================================================================================================================================================================================================
/**
 * Установить тип устройства
 * @param {string} type Тип устройства
 */
function defineAs(type) {
   _dom.el.add(type);
   _is.touch = type === "touch";
}
//=======================================================================================================================================================================================================================================================
// ! Новая реализация (На данный момент userAgentData работает не корректно)
// if (navigator.userAgentData) { // Проверка поддерживается ли userAgentData
//    (navigator.userAgentData.mobile) ? defineAs("touch") : defineAs("mouse");
// } else {
//    const mob = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i); // Вернется объект если найдено соответствие мобильного устройства
//    (mob) ? defineAs("touch") : defineAs("mouse");
// }
//=======================================================================================================================================================================================================================================================
const mob = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i); // Вернется объект если найдено соответствие мобильного устройства
(mob) ? defineAs("touch") : defineAs("mouse");
//=======================================================================================================================================================================================================================================================