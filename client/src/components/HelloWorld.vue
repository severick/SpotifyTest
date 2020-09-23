<template>
  <v-container>
    <template v-if="this.user">
      <h1>Hi there, {{ this.user.display_name }}</h1>
      <img :src="this.user.images[0].url" alt="profile_picture" class="profile_pic">
      <p>Email address: {{ this.user.email }}</p>
      <p>
        <a :href="this.user.external_urls.spotify">Link to your profile</a>
      </p>
      <p>Number of followers: {{ this.user.followers.total }}</p>
      <p>
        <v-btn @click='topTracks' class="btn btn-primary">Top Tracks</v-btn>
      </p>


    </template>
    <template v-else>
      <h1>Log in to Spotify using Authorization Code flow</h1>
      <v-btn @click="login" class="btn btn-primary">Log in with Spotify</v-btn><br>
    </template>
  </v-container>

</template>

<script>
import config from '../config'
import Vue from 'vue'
import Tracks from './Tracks.vue'

export default {
    name: 'HelloWorld',
    data() {
        return {
            email: ''
        }
    },
    computed: {
        user() {
          return this.$store.getters.getUser
        },
        accessToken() {
          return this.$store.getters.getAccess
        },
        refreshToken() {
          return this.$store.getters.getRefresh
        },
        tracks() {
          return this.$store.getters.getTracks
        }
    },
    methods: {
        login() {
		console.log(process.env.VUE_APP_BACKEND);
		console.log(config.services.host);
          Vue.axios.get(`${config.services.host}/login`);
        },
        logOut() {
            this.$store.commit('mutateUser', null);
            this.$router.push({ name: 'Home'})
        },
        topTracks() {
          Vue.axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=5', {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.access_token
            }
          }).then((response) => {
            console.log(response.data)
            this.$store.commit('setTracks', response.data.items);
            this.$router.push('/topTracks')
            console.log("state tracks are " )
            console.log(this.$store.state.tracks)
          })
        }
    },
    created() {
        if (this.$route.query) {
            Vue.axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + this.$route.query.access_token
                }
            }).then((response) => {
                this.$store.commit('setUser', response.data);
                this.$store.commit('mutateAccessToken', this.$route.query.access_token);
                this.$store.commit('mutateRefreshToken', this.$route.query.refresh_token);
                this.$store.dispatch('refreshTokens', this.$route.query );
                this.$router.push({ name: 'HelloWorld'})
            })
        }
    }
}
</script>

<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .profile_pic {
    width: 100px;
  }
</style>\
