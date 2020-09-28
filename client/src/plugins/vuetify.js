import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  customVariables: ['~/sass/variables.scss'],
  treeShake: true,
  theme: {
    options: {
      customProperties: true,
    },
    dark: true,
    themes: {
      dark: {
        background: '#252323'
      }
    }
  }
});
