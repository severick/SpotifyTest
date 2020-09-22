import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from "../components/HelloWorld.vue";
import Tracks from "../components/Tracks.vue";
Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld,
            meta: {
                title: 'Spotify Authorization Code example page',
            },
        },
        {
            path: '/topTracks',
            name: 'Tracks',
            component: () => import('../components/Tracks.vue') ,
            meta:{
                title: 'Top Tracks'
            }
        }
    ]
});

export default router;