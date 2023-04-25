//=======================================================================================================================================================================================================================================================
/** Управляет API */
//=======================================================================================================================================================================================================================================================
import _dom from "../exports/dom.js";
//=======================================================================================================================================================================================================================================================
/**
 * Генерировать уникальный ID
 * @returns {string} Уникальный ID
 */
function generateUniqueId() {
   const timestamp = new Date().getTime();
   const randomNumber = Math.random().toString().substring(2, 8);

   return `${timestamp}-${randomNumber}`;
}
const cookieUserID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*=\s*([^;]*).*$)|^.*$/, "$1");
const userID = cookieUserID || generateUniqueId();
//=======================================================================================================================================================================================================================================================
if (!cookieUserID) document.cookie = `userID=${userID};HttpOnly;SameSite=strict;Secure;path=/;domain=${location.hostname};max-age=60*60*24*365`;
//=======================================================================================================================================================================================================================================================