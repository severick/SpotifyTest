<template>
  <v-container>
    <template v-if="this.user">
      <h1>Hi there, {{ this.user.display_name }}</h1>
      <img :src="this.user.images[0].url" alt="profile_picture" class="profile_pic" />
      <v-container>
        <h3>Here are your top tracks</h3>
        <div class="tracks">
          <v-slide-group>
            <v-card
              flat
              outlined
              tile
              v-for="value in tracks"
              :key="value.id"
              class="d-flex flex-wrap track"
            >
              <v-hover v-slot:default="{ hover }">
                <div class="track_info">
                  <div class="album_art">
                    <v-img
                      :class="{'on-hover': hover}"
                      height="150"
                      width="150"
                      :src="value.album.images[0].url"
                    >
                      <v-row class="fill-height flex-column" justify="space-around">
                        <div class="align-self-center">
                          <v-btn
                            @click="playPreview(value.preview_url)"
                            :class="{'show-btn': hover } "
                            color="transparent"
                            icon
                          >
                            <v-icon :class="{ 'show-btn': hover }" size="36">mdi-play</v-icon>
                          </v-btn>
                          <v-btn
                            @click="pausePreview()"
                            :class="{'show-btn': hover } "
                            color="transparent"
                            icon
                          >
                            <v-icon :class="{'show-btn': hover }" size="36">mdi-pause</v-icon>
                          </v-btn>
                        </div>
                      </v-row>
                    </v-img>
                  </div>
                  <div class="ablum_info">
                    <p>{{value.artists[0].name}}</p>
                    <p>{{value.name}}</p>
                  </div>
                  <template>
                    <v-bottom-navigation color="primary" v-if="hover" absolute>
                      <v-btn @click="analyzeTrack(value.id)">
                        <span>Recommendations</span>
                        <v-icon>mdi-arm-flex</v-icon>
                      </v-btn>
                      <v-btn>
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                      <v-btn>
                        <v-icon>mdi-map-marker</v-icon>
                      </v-btn>
                    </v-bottom-navigation>
                  </template>
                </div>
              </v-hover>
            </v-card>
          </v-slide-group>
        </div>
      </v-container>
    </template>
    <template v-if="this.recommendations">
      <v-container class="d-flex-inline">
        <v-col
          md="4"
          class="ml-auto ">
          <h3 class="d-flex">How's this playlist?</h3>
        </v-col>
        <v-row
          class="d-flex justify-end"
          v-for="value in recommendations.tracks"
          :key="value.id"
        >
          <v-col :cols="$vuetify.breakpoint.xs ? 12 : 7" class="justify-end ma-0 pa-0 playlist">
            <!-- <v-list>
              <div class="d-flex justify-end">
                <div class="d-inline-block justify-start text-truncate"> 
                  <v-card-title class="headline" v-text="value.name"></v-card-title>
                  <v-card-subtitle v-text="value.artists[0].name"></v-card-subtitle>
                </div>
                <v-avatar class="ma-3" size="75" tile>
                  <v-img :src="value.album.images[0].url" max-height="100" max-width="100"></v-img>
                </v-avatar>
              </div>
                  <v-divider/>
            </v-list> -->
            <v-row no-gutters class="d-flex justify-end" >
              <v-col md=4 class="d-inline-block text-truncate">
                  <v-card-title class="headline" v-text="value.name"></v-card-title>
                  <v-card-subtitle v-text="value.artists[0].name"></v-card-subtitle>
              </v-col>
              <v-col cols="auto pl-2">
                  <v-img class="ml-auto" :src="value.album.images[0].url" max-height="75" max-width="75"></v-img>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";

var audio = new Audio();

export default {
  name: "Tracks",
  data() {
    return {
      email: "",
      active: true,
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
    },
    col() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs' : return 
      }
    }
  },
  methods: {
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },
    playPreview(sound) {
      var audio = document.getElementById("audio");
      if (sound) {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = sound;
          audio.load();
          audio.play();
        } else {
          const audio_element = document.body.appendChild(
            document.createElement("audio")
          );
          audio_element.id = "audio";
          audio_element.src = sound;
          audio_element.load();
          audio_element.play();
        }
      }
    },
    pausePreview() {
      var audio = document.getElementById("audio");
      if (audio) {
        audio.pause();
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
          }
        )
        .then((response) => {
          this.$store.commit("mutateTracks", response.data);
          this.$router.push({ name: "HelloWorld" });
        });
    },
    analyzeTrack(trackId) {
      Vue.axios
        .get("https://api.spotify.com/v1/audio-features/" + trackId, {
          headers: {
            Authorization: "Bearer " + this.$store.state.access_token,
          },
        })
        .then((response) => {
          this.$store.commit("setAnalysis", response.data);
          this.bpmSeed(this.analysis);
        });
    },
    bpmSeed(track) {
      Vue.axios
        .get(
          "https://api.spotify.com/v1/recommendations?seed_artists=" +
            this.$store.state.tracks[0].artists[0].id +
            "&seed_tracks=" +
            track.id +
            "&target_tempo=" +
            track.tempo,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.access_token,
            },
          }
        )
        .then((response) => {
          this.$store.commit("setRecommendations", response.data);
        });
    },
    createPlaylistFromSeed() {
      const self = this;
      const options = {
        method: "post",
        headers: {
          Authorization: "Bearer " + this.$store.state.access_token,
          "Content-Type": "application/json",
        },
        url:
          "https://api.spotify.com/v1/users/" +
          this.$store.state.user.id +
          "/playlists",
        data: {
          name: "Test Playlist",
          description: "Created From my app",
          public: false,
        },
      };

      Vue.axios(options).then(function (response) {
        const newArray = self.$store.state.recommendations.tracks.map(
          (element) => element.uri
        );
        const playlistOptions = {
          method: "post",
          headers: {
            Authorization: "Bearer " + self.$store.state.access_token,
            "Content-Type": "application/json",
          },
          url:
            "https://api.spotify.com/v1/playlists/" +
            response.data.id +
            "/tracks",
          data: {
            uris: newArray,
          },
        };
        Vue.axios(playlistOptions);
      });
    },
  },
  created() {},
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
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