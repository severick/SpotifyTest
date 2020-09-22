import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        access_token: null,
        refresh_token: null,
        tracks: null,
        analysis: null,
        recommendations: null
    },
    actions: {
        
        refreshTokens(context, credentials) {
            const self = this;
            const options = {
                method: 'get',
                url: "http://localhost:8081/refresh",
                headers: { 
                    refresh_token: credentials.refresh_token,
                },
            }
            Vue.axios(options).then(function(response) {
                var parsedResponse = JSON.parse(response.data);
                self.commit('mutateAccessToken', parsedResponse.access_token);
            });
            this.dispatch('autoRefresh', credentials);
        },
        autoRefresh( context, credentials) {
            const {state, commit, dispatch } = context
            const access_token = credentials.access_token
            let timeUntilRefresh = 3600000
            const refreshTask = setTimeout(() => this.dispatch('refreshTokens', credentials), timeUntilRefresh)
        }
    },
    mutations: {
      setUser(state, user) {
          state.user = user;
      },
      setTracks(state, payload) {
          state.tracks = payload;
      },
      mutateAccessToken(state, payload) {
          state.access_token = payload;
      },
      mutateRefreshToken(state, payload) {
          state.refresh_token = payload;
      },
      setAnalysis(state, payload) {
          state.analysis = payload;
      },
      setRecommendations(state, payload) {
          state.recommendations = payload;
      }
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getAccess(state) {
            return state.access_token
        },
        getRefresh(state) {
            return state.refresh_token
        },
        getTracks(state) {
            return state.tracks
        },
        getAnalysis(state) {
            return state.analysis;
        },
        getRecommendations(state) {
            return state.recommendations;
        }
    },
    plugins: [
        createPersistedState()
    ]
});