import { createRouter, createWebHistory } from 'vue-router';
import PlaylistManager from './views/PlaylistManager.vue';
import Jukebox from './views/Jukebox.vue';

const routes = [
  { path: '/', component: Jukebox },
  { path: '/playlists', component: PlaylistManager }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;