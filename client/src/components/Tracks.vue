<template>
  <v-container>
    <template v-if="this.user">
      <h1>Hi there, {{ this.user.display_name }}</h1>
      <img :src="this.user.images[0].url" alt="profile_picture" class="profile_pic" />
      <h3>Here are your top tracks</h3>
      <v-container>
        <div class="tracks">
          <v-slide-group
          >
            <v-card
              flat
              outlined
              tile
              v-for="value in tracks"
              :key="value.id"
              class="d-flex flex-wrap track"
            >
              <div class="track_info">
                <div class="album_art">
                  <v-hover v-slot:default="{ hover }">
                    <v-img
                      :class="{'on-hover': hover}"
                      height="250"
                      width="250"
                      :src="value.album.images[0].url"
                    >
                    <v-row class="fill-height flex-column" justify="space-around">
                      <div class="align-self-center">
                        <v-btn @click="playPreview(value.preview_url)" :class="{'show-btn': hover } " color="transparent"  icon>
                          <v-icon :class="{ 'show-btn': hover }" size=36>
                          mdi-play
                          </v-icon>
                        </v-btn>
                        <v-btn @click="pausePreview()" :class="{'show-btn': hover } " color="transparent"  icon>
                        <v-icon :class="{'show-btn': hover }" size=36>
                            mdi-pause
                          </v-icon>
                        </v-btn>
                      </div>
                    </v-row>
                    </v-img>
                  </v-hover>
                </div>
                <div class="ablum_info">
                  <p>{{value.artists[0].name}}</p>
                  <p>{{value.name}}</p>
                </div>
                  <v-btn @click="analyzeTrack(value.id)"> Analyze Track</v-btn>
                  <v-btn @click="bpmSeed(analysis)"> Get Recommendations</v-btn>
              </div>
            </v-card>
          </v-slide-group>
        </div>
      </v-container>
    </template>
    <template v-if="this.recommendations">
      <v-container>
        <div class="recommendations">
          <v-slide-group
          >
            <v-card
              flat
              outlined
              tile
              v-for="value in recommendations.tracks"
              :key="value.id"
              class="d-flex flex-wrap track"
            >
              <div class="track_info">
                <div class="album_art">
                  <v-hover v-slot:default="{ hover }">
                    <v-img
                      :class="{'on-hover': hover}"
                      height="250"
                      width="250"
                      :src="value.album.images[0].url"
                    >
                    <v-row class="fill-height flex-column" justify="space-around">
                      <div class="align-self-center">
                        <v-btn @click="playPreview(value.preview_url)" :class="{'show-btn': hover } " color="transparent"  icon>
                          <v-icon :class="{ 'show-btn': hover }" size=36>
                          mdi-play
                          </v-icon>
                        </v-btn>
                        <v-btn @click="pausePreview()" :class="{'show-btn': hover } " color="transparent"  icon>
                        <v-icon :class="{'show-btn': hover }" :size=36>
                            mdi-pause
                          </v-icon>
                        </v-btn>
                      </div>
                    </v-row>
                    </v-img>
                  </v-hover>
                </div>
                <div class="ablum_info">
                  <p>{{value.artists[0].name}}</p>
                  <p>{{value.name}}</p>
                </div>
                  <v-btn @click="analyzeTrack(value.id)"> Analyze Track</v-btn>
                  <v-btn @click="bpmSeed(analysis)"> Get Recommendations</v-btn>
              </div>
            </v-card>
          </v-slide-group>
        </div>
        <v-btn @click="createPlaylistFromSeed(analysis)"> Get Recommendations</v-btn>

      </v-container>
    </template>
    <template v-else>
      <h1>Log in to Spotify using Authorization Code flow</h1>
      <a href="http://localhost:8081/login" class="btn btn-primary">Log in with Spotify</a>
      <br />
    </template>
  </v-container>
</template>

<script>
import Vue from "vue";
import mdiPlay from '@mdi/js'
import { mapState, mapActions } from "vuex";

var audio = new Audio();

export default {
  name: "Tracks",
  data() {
    return {
      icon: mdiPlay,
      email: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    accessToken() {
      return this.$store.getters.getAccess;
    },
    refreshToken() {
      return this.$store.getters.getRefresh;
    },
    tracks() {
      return this.$store.getters.getTracks;
    },
    analysis() {
      return this.$store.getters.getAnalysis;
    },
    recommendations() {
      return this.$store.getters.getRecommendations;
    }
  },
  methods: {
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
    playPreview(sound) {
      var audio = document.getElementById('audio')
      if(sound) {
        if(audio) {
          audio.pause()
          audio.currentTime = 0;
          audio.src = sound
          audio.load();
          audio.play();
        } else {
          const audio_element = document.body.appendChild(document.createElement('audio'))
          audio_element.id = 'audio'
          audio_element.src = sound
          audio_element.load();
          audio_element.play();
        }
      }
    },
    pausePreview() {
      var audio = document.getElementById('audio')
      if(audio) {
        audio.pause()
        audio.currentTime = 0;
      }
    },
    topTracks() {
      Vue.axios
        .get(
          "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=5",
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.access_token,
            },
          })
        .then((response) => {
          this.$store.commit("mutateTracks", response.data);
          this.$router.push({ name: "HelloWorld" });
        });
    },
    analyzeTrack(trackId) {
      Vue.axios.get("https://api.spotify.com/v1/audio-features/" + trackId,
      {
        headers: {
          Authorization: "Bearer " + this.$store.state.access_token,
        }
      }).then((response) => {
        this.$store.commit("setAnalysis", response.data);
      })
    },
    bpmSeed(track) {
      Vue.axios.get("https://api.spotify.com/v1/recommendations?seed_artists=" + this.$store.state.tracks[0].artists[0].id + "&seed_tracks=" + track.id + "&target_tempo=" + track.tempo, {
        headers: {
          Authorization: "Bearer " + this.$store.state.access_token,
        }
      }).then((response) => {
        this.$store.commit("setRecommendations", response.data);
      })
    },
    createPlaylistFromSeed() {
      const self = this;
      const options = {
        method: 'post',
        headers: { Authorization: "Bearer " + this.$store.state.access_token,
                   'Content-Type': "application/json",
        },
        url: "https://api.spotify.com/v1/users/" + this.$store.state.user.id + "/playlists",
        data: {
          "name": "Test Playlist",
          "description": "Created From my app",
          "public": false
        }
      }

      Vue.axios(options).then( function(response) {
        const newArray = self.$store.state.recommendations.tracks.map(element => element.uri);
        const playlistOptions = {
          method: 'post',
          headers: { Authorization: "Bearer " + self.$store.state.access_token,
                    'Content-Type': "application/json",
          },
          url: "https://api.spotify.com/v1/playlists/" + response.data.id + "/tracks",
          data: {
            uris: newArray
          }
        }
        Vue.axios(playlistOptions);
      });
    },
  },
  created() {
    if (this.$route.query) {
      Vue.axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + this.$route.query.access_token,
          },
        })
        .then((response) => {
          this.$store.commit("mutateUser", response.data);
          this.$store.commit(
            "mutateAccessToken",
            this.$route.query.access_token
          );
          this.$store.commit(
            "mutateRefreshToken",
            this.$route.query.refresh_token
          );
          this.$router.push({ name: "HelloWorld" });
        });
    }
  },
};
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
.track_info {
  padding: 20px 20px 15px;
  background: #282828;
}
.v-image {
  opacity: 0.6;
  transition: opacity 0.4s ease-in-out;
}
.v-image:not(.on-hover) {
  opacity: 1;
}

.show-btn {
  color: rgb(197, 13, 13, 1) !important;
  opacity: 1;
}
</style>