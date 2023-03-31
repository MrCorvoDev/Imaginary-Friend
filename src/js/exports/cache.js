//=======================================================================================================================================================================================================================================================
const debug = false && process.env.NODE_ENV === "development";
/**
 * Управлять кэшем функции
 * @param {string} id Уникальное название хранилище кэша для этой функции
 * @param {Function} func Функция для управления
 * @param {Function.args} args Аргументы функции
 * @param {(string|number|boolean)} [key=auto] Ключ из аргументов для кэша("auto" значит создаст строку со всеми аргументами)["auto"]
 * @param {number} [maxSize=4] Максимальный размер хранилища[4]
 * @returns {*} Возвращаемое значение функции
 */
function _handleCache(id, func, args, key = "auto", maxSize = 4) {
   cache[id] ??= new LRUCache(maxSize); // Если функция вызывается впервые создать для нее новое хранилище

   if (key === "auto") {
      key = "";
      for (let i = 0; i < args.length; i++) key += `${args[i]}_`; // Создать ключ из аргументов для записи в хранилище
   }

   if (cache[id].get(key) === undefined) { // Если такого ключа нет
      const result = func.apply(null, args); // Выполнить функцию
      cache[id].put(key, result); // Записать значение в хранилище

      if (debug) console.log(`Cache for ${id} created`);
      return result;
   }

   if (debug) console.log(`Cache for ${id} used`);
   return cache[id].get(key); // Вернуть кэшированное значение
}
/** Объект с кэшом */
export const cache = {};
class LRUCache {
   /**
    * Создать новое хранилище кэша
    * @param {number} maxSize Максимальный размер кэша
    */
   constructor(maxSize = 4) {
      this.head = null;
      this.tail = null;
      this.size = 0;
      this.maxSize = maxSize;
      this.cache = {};
   }
   /**
    * Добавить запись в хранилище кэша
    * @param {string} key Ключ
    * @param {*} value Значение
    * @returns {object} Хранилище кэша
    */
   put(key, value) {
      let newNode;

      if (this.cache[key] === undefined) newNode = {key: key, value: value, next: null, prev: null}; // Если не существует то создать

      if (this.size === 0) { // Если список пустой
         this.head = newNode;
         this.tail = newNode;
         this.size++;
         this.cache[key] = newNode;
         return this;
      }

      if (this.size === this.maxSize) { // Если превышено максимальная длина списка
         delete this.cache[this.tail.key]; // Удалить из кэша

         this.tail = this.tail.prev; // Установить новый хвост
         this.tail.next = null;
         this.size--;
      }

      // Добавить элемент в начало
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
      this.size++;

      // Добавить в кэш
      this.cache[key] = newNode;
      return this;
   }
   /**
    * Получить значение ключа
    * @param {string} key Ключ
    * @returns {*} Значение ключа
    */
   get(key) {
      if (!this.cache[key]) return undefined; // Если не существует вернуть undefined

      const foundNode = this.cache[key];

      if (foundNode === this.head) return foundNode.value; // Если он вызывался предыдущий раз то вернуть

      const previous = foundNode.prev;
      const next = foundNode.next;

      if (foundNode === this.tail) { // Если он вызывался самый последний в списке
         previous.next = null;
         this.tail = previous;
      } else {
         previous.next = next;
         next.prev = previous;
      }

      // Установить его первым в списке
      this.head.prev = foundNode;
      foundNode.next = this.head;
      foundNode.prev = null;
      this.head = foundNode;

      return foundNode.value;
   }
}
//=======================================================================================================================================================================================================================================================
export default _handleCache;
//=======================================================================================================================================================================================================================================================