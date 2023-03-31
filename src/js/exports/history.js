//=======================================================================================================================================================================================================================================================
const debug = false && process.env.NODE_ENV === "development";
/**
 * Управление историей
 * @namespace
 * @property {Function} push {@link _history.push} Добавить запись с свойством в историю
 * @property {Function} hash {@link _history.hash} Если переход только из-за hash тогда стереть hash из поля url и добавить о нем запись в историю
 */
const _history = {};
/**
 * Добавить запись с свойством в историю учитывая приватные записи
 * @param {string} property Имя свойства объекта
 * @param {string} value Значение свойства объекта
 * @param {boolean} [condition=Если записи нет] Условие действия [Если в истории такой записи нет то тогда добавить]
 */
_history.push = function (property, value, condition = (history.state?.[property] !== value)) {
   if (!condition) return;

   const state = {};
   state[property] = value;
   if (history.state?.private) { // Если предыдущая созданная запись была с private тогда заменить ее новой записью
      state.private = false;
      history.replaceState(state, "", location.href.replace(location.hash, ""));
      if (debug) console.log("replaceState =", history.state);
   } else {
      history.pushState(state, "", location.href.replace(location.hash, ""));
      if (debug) console.log("pushState =", history.state);
   }
};
/**
 * Если переход произошел только из-за hash тогда стереть hash из поля url и добавить о нем запись в историю
 * @param {string} property Имя свойства объекта
 * @param {string} value Значение свойства объекта
 * @param {boolean} [isPrivate=false] Является ли запись приватной [false]
 */
_history.hash = function (property, value, isPrivate) {
   if (history.state?.[property] && !location.hash) return;

   const state = {};

   if (isPrivate) {
      state[property] = "";
      state.private = true;
   } else state[property] = value;

   history.replaceState(state, "", location.href.replace(location.hash, ""));
   if (debug) console.log("hashReplaceState =", history.state);
};
//=======================================================================================================================================================================================================================================================
export default _history;
//=======================================================================================================================================================================================================================================================