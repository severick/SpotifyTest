module.exports = {
  "devServer": {
    "port": 8080
  },
  "configureWebpack": {
    "plugins": [
      {
        "definitions": {
          "_": "lodash"
        }
      },
    ]
  },
  "transpileDependencies": [
    "vuetify"
  ]
}