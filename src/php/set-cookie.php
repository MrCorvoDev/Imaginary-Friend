<?php
$user_id = file_get_contents("php://input");

setcookie(
   'userID', // Имя
   $user_id, // Значение
   time() + 60 * 60 * 24 * 365, // Время истечения
   '/', // Путь
   '.' . $_SERVER['HTTP_HOST'], // Домен
   true, // Secure
   true // HttpOnly
);
