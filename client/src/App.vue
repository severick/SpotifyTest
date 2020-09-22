<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <template v-if="this.user == null">
        <v-menu 
          bottom
          min-width="200px"
          rounded
          offset-y
        >
        <template v-slot:activator="{on}">
          <v-btn
            icon
            x-larg
            v-on="on"
          >
          <v-avatar
            size="36px"
            color="brown">
          </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
              </v-avatar>
              <h3>LOGIN</h3>
              <p class="caption mt-1">
                Login
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
              Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
              Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
       </v-menu>
      </template>
      <template v-else>
        <v-menu 
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{on}">
            <v-btn
              icon
              x-larg
              v-on="on"
            >
            <v-avatar
              size="36px">
              <img :src="user.images[0].url">
            </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  size="36px">
                  <img :src="user.images[0].url">
                </v-avatar>
                <h3>{{user.display_name}}</h3>
                <p class="caption mt-1">
                  {{user.email}}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  depressed
                  rounded
                  text
                >
                Edit Account
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  depressed
                  rounded
                  text
                >
                Logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
       </template>
    </v-app-bar>

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
