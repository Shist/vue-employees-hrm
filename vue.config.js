const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/../node_modules/vuetify/_styles.scss";
          @import "@/assets/styles/global";
        `,
      },
    },
  },
});
