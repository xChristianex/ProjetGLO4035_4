import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Inventaire from '@/components/Inventaire';
import Artist from '@/components/Artist';
import MLab from '@/components/MLab';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }, {
      path: '/artist',
      name: 'Artist',
      component: Artist
    }, {
      path: '/inventaire',
      name: 'Inventaire',
      component: Inventaire
    }, {
      path: '/mlab',
      name: 'MLab',
      component: MLab
    }
  ],
});
