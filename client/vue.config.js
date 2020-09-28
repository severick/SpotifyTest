module.exports = {
  "devServer": {
    "port": 8080
  },
  pluginOptions: {
    "style-resources-loader": {
      "preProcessor": "scss",
      "patterns": []
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "sass/variables.scss`
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      match (originalTag, { kebabTag, camelTag, path, component }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
        }
      }
    }])
}
}