//=======================================================================================================================================================================================================================================================
import realFavicon from "gulp-real-favicon";
import fs from "fs";
import path from "../config/path.js";
//=======================================================================================================================================================================================================================================================
/**
 * Генерировать Favicon
 * @param {Function} done Callback
 */
const generateFavicon = done => {
   if (!fs.existsSync(path.clean[0])) fs.mkdirSync(path.clean[0]); // Если временной папки нет - создать
   realFavicon.generateFavicon({ // Создать новый конфиг https://realfavicongenerator.net/favicon/gulp
      masterPicture: path.src.ico,
      dest: path.dist.ico,
      iconsPath: "♔img/favicon/",
      design: {
         ios: {
            pictureAspect: "noChange",
            assets: {
               ios6AndPriorIcons: false,
               ios7AndLaterIcons: false,
               precomposedIcons: false,
               declareOnlyDefaultIcon: true
            }
         },
         desktopBrowser: {
            design: "raw"
         },
         windows: {
            pictureAspect: "noChange",
            backgroundColor: "#131218",
            onConflict: "override",
            assets: {
               windows80Ie10Tile: false,
               windows10Ie11EdgeTiles: {
                  small: false,
                  medium: false,
                  big: true,
                  rectangle: false
               }
            }
         },
         androidChrome: {
            pictureAspect: "noChange",
            themeColor: "#131218",
            manifest: {
               name: "App",
               startUrl: "https://mister-corvo.com",
               display: "standalone",
               orientation: "notSet",
               onConflict: "override",
               declared: true
            },
            assets: {
               legacyIcon: false,
               lowResolutionIcons: false
            }
         }
      },
      settings: {
         compression: 2,
         scalingAlgorithm: "Mitchell",
         errorOnImageTooSmall: false,
         readmeFile: false,
         htmlCodeFile: false,
         usePathAsIs: false
      },
      markupFile: path.dist.icoOpts
   }, () => done());
};
//=======================================================================================================================================================================================================================================================
export default generateFavicon;
//=======================================================================================================================================================================================================================================================