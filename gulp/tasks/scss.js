//=======================================================================================================================================================================================================================================================
import dartSass from "sass";
import gulpSass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import webpcss from "gulp-webpcss";
import autoprefixer from "gulp-autoprefixer";
import gulp from "gulp";
import path from "../config/path.js";
import {notifyError} from "../exports/notifyError.js";
import {ifDev, ifProd} from "../exports/mode.js";
import replace from "gulp-replace";
import browserSync from "browser-sync";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
//=======================================================================================================================================================================================================================================================
const sass = gulpSass(dartSass);
const compileSCSS = () => gulp.src(path.src.scss)
   .pipe(ifDev(sourcemaps.init()))
   .pipe(notifyError("SCSS"))
   .pipe(sass({
      includePaths: ["node_modules"],
      outputStyle: "expanded"
   }))
   .pipe(ifDev(replace(/♔/g, "../"), replace(/♔/g, `/${path.ftpRoot}/${path.rootF}/`)))
   .pipe(ifProd(webpcss({
      webpClass: ".js_s-webp",
      noWebpClass: ".js_s-no-webp"
   })))
   .pipe(ifProd(autoprefixer({
      grid: true,
      cascade: true
   })))
   .pipe(ifProd(cleanCss({level: 2})))
   .pipe(rename({
      extname: ".css"
   }))
   .pipe(ifDev(sourcemaps.write()))
   .pipe(gulp.dest(path.dist.css))
   .pipe(browserSync.stream());
//=======================================================================================================================================================================================================================================================
export default compileSCSS;
//=======================================================================================================================================================================================================================================================