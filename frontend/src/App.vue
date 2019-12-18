<template>
  <div id="app">
    <div class="container">
      <div id="login">
        <h1>This is an example of the Authorization Code flow</h1>
        <button type="button" class="btn btn-primary" @click="login">Log in with Spotify</button>
      </div>
      <div id="loggedin">
        <div id="user-profile">
        </div>
        <div id="oauth">
        </div>
        <button class="btn btn-default" id="obtain-new-token">Obtain new token using the refresh token</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  
  },
  methods: {
    login() {
      return this.$http.get("/login");
    }
  }
}



</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
