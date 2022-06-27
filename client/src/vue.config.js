module.exports = {
  devServer: {
    proxy: 'http://localhost:8081',
    watchOptions: {
      poll: true
    }
  },
  "configureWebpack": {
    "plugins": [
      {
        "definitions": {
          "_": "lodash"
        }
      },
    ],
    "devtool": 'source-map'
  },
  "transpileDependencies": [
    "vuetify"
  ]
}