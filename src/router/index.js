import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/library', name: 'library', component: () => import('../views/LibraryView.vue') },
        { path: '/prediction', name: 'prediction', component: () => import('../views/PredictionView.vue') },
        { path: '/watch', name: 'watch', component: () => import('../views/WatchListView.vue') },
        { path: '/collection', name: 'collection', component: () => import('../views/CollectionView.vue') },
        { path: '/player/:id', name: 'player', component: () => import('../views/PlayerView.vue') },
        { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    ],
    // 切换页面时滚动到顶部
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router