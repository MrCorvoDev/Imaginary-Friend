//=======================================================================================================================================================================================================================================================
import plumber from "gulp-plumber";
import notify from "gulp-notify";
//=======================================================================================================================================================================================================================================================
/**
 * Уведомлять при ошибке
 * @param {string} title Заголовок уведомления
 */
export const notifyError = title => plumber(notify.onError({
   title: title,
   message: "Error: <%= error.message %>"
}));
//=======================================================================================================================================================================================================================================================