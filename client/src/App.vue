<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },
  computed: {
    user() {
          return this.$store.getters.getUser
        },
  },

  data: () => ({
    //
  }),
};
</script>
