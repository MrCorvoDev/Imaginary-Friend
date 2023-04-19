//=======================================================================================================================================================================================================================================================
/** Предустановленные профили */
const profiles = {
   "1": {
      "profile-name": "Rock Believer",
      "name": "Mikkey",
      "typing-delay": "on",
      "quantity": "22",
      "gender": "2",
      "hobbies": "rock 'n roll playing, spend time with groupies, hanging out with my band",
      "music-genres": "hard rock, heavy metal, glam metal",
      "music-artists": "scorpions, deep purple, def leppard",
      "movie-genres": "music, action",
      "movies": "almost famous, empire records"
   },
   "2": {
      "profile-name": "Programmer Freak",
      "name": "Elliot",
      "typing-delay": "on",
      "quantity": "21",
      "gender": "2",
      "hobbies": "programming, hacking",
      "music-genres": "hard rock, rap, alternative rock, alternative metal, post-grunge, heavy metal, sleaze rock, hip hop",
      "music-artists": "hypnogaja, buckcherry, eminem, scorpions, the exies, papa roach",
      "movie-genres": "horror, science fiction",
      "movies": "cruella, fight club, mr. robot, hackers"
   },
   "3": {
      "profile-name": "Supernatural Fan",
      "name": "Rowena",
      "typing-delay": "on",
      "quantity": "23",
      "gender": "1",
      "hobbies": "ghost hunting, exorcism, dealing with demons",
      "music-genres": "rock 'n roll, hard rock, metal, heavy metal",
      "music-artists": "queen, ac/dc, scorpions, manowar, kiss",
      "movie-genres": "horror, action, comedy, drama",
      "movies": "supernatural, scream, friday the 13th"
   }
};
if (!localStorage.getItem("profile(1)")) {
   const keys = Object.keys(profiles);
   for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      localStorage.setItem(`profile(${key})`, JSON.stringify(profiles[key]));
      const profilesLength = localStorage.getItem("profiles") || 0;
      localStorage.setItem("profiles", +profilesLength + 1);
   }
}
//=======================================================================================================================================================================================================================================================