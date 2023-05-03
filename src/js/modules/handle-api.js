//=======================================================================================================================================================================================================================================================
/** Управляет API */
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
const isIDAdded = document.cookie.replace(/(?:(?:^|.*;\s*)isUserID\s*=\s*([^;]*).*$)|^.*$/, "$1");
//=======================================================================================================================================================================================================================================================
(async () => {
   if (!isIDAdded) {
      const userID = generateUniqueId();
      await fetch("♔php/set-cookie.php?v=2", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: userID
      });
      document.cookie = `isUserID=true;path=/;domain=${location.hostname};max-age=${60 * 60 * 24 * 365}`;
   }
})();
//=======================================================================================================================================================================================================================================================