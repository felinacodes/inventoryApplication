const browserSync = require('browser-sync').create();

browserSync.init({
  proxy: "http://localhost:3068", 
  files: ["public/css/*.css", 
          "views/**/*.ejs"], 
  reloadDelay: 1000, 
  open: false // Prevents BrowserSync from automatically opening a new browser window
});

module.exports = browserSync;