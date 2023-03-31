//=======================================================================================================================================================================================================================================================
import nunjucksRender from "gulp-nunjucks-render";
import data from "gulp-data";
import versionsNumber from "gulp-version-number";
import htmlMinify from "html-minifier";
import gulp from "gulp";
import path from "../config/path.js";
import {notifyError} from "../exports/notifyError.js";
import {ifDev, ifProd, isDev} from "../exports/mode.js";
import fs from "fs";
import realFavicon from "gulp-real-favicon";
import replace from "gulp-replace";
import browserSync from "browser-sync";
import nodePath from "path";
//=======================================================================================================================================================================================================================================================
const manageEnvironment = environment => {
   environment.addGlobal("isDev", !process.argv.includes("--build"));
   environment.addGlobal("isProd", process.argv.includes("--build"));
   environment.addFilter("split", (value, char) => value.split(char));
};
const base = `${path.srcF}/html`;
/** Компилировать HTML */
const compileHTML = () => gulp.src(path.src.html, {base})
   .pipe(notifyError("HTML"))
   .pipe(data(file => {
      const obj = nodePath.parse(nodePath.relative(base, file.path));
      return JSON.parse(fs.readFileSync(`${base}/data/${obj.dir}/${obj.name}.json`));
   }))
   .pipe(data(() => JSON.parse(fs.readFileSync("./src/html/data/global.json"))))
   .pipe(nunjucksRender({
      path: "src/html/components",
      manageEnv: manageEnvironment
   }))
   .pipe(ifProd(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(path.dist.icoOpts)).favicon.html_code)))
   .pipe(ifDev(replace(/♔/g, "./"), replace(/♔/g, `/${path.ftpRoot}/${path.rootF}/`)))
   .pipe(ifProd(versionsNumber({
      "value": "%DT%",
      "append": {
         "key": "v",
         "to": [
            "css",
            "js",
         ]
      }
   })))
   .on("data", function (file) {
      if (isDev) return;

      return file.contents = Buffer.from(htmlMinify.minify(file.contents.toString(), {
         minifyCSS: true,
         minifyJS: true,
         includeAutoGeneratedTags: true,
         removeAttributeQuotes: true,
         removeComments: true,
         removeRedundantAttributes: true,
         removeScriptTypeAttributes: true,
         removeStyleLinkTypeAttributes: true,
         sortClassName: true,
         useShortDoctype: true,
         collapseWhitespace: true
      }));
   })
   .pipe(gulp.dest(path.dist.html))
   .pipe(browserSync.stream());
//=======================================================================================================================================================================================================================================================
export default compileHTML;
//=======================================================================================================================================================================================================================================================