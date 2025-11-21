<script setup>
import { ref } from 'vue'
import AnimeCard from '@/components/AnimeCard.vue'
import CharacterCard from '@/components/CharacterCard.vue' // 引入新组件

const activeTab = ref('character')

// 模拟角色数据
const characters = ref([
  { id: 1, name: '艾伦·耶格尔', source: '进击的巨人', img: 'https://picsum.photos/100/133?9', tag: '主角' },
  { id: 2, name: '灶门炭治郎', source: '鬼灭之刃', img: 'https://picsum.photos/100/133?10', tag: '猎鬼人' },
  { id: 3, name: '五条悟', source: '咒术回战', img: 'https://picsum.photos/100/133?11', tag: '最强' },
  { id: 4, name: '玛奇玛', source: '电锯人', img: 'https://picsum.photos/100/133?12', tag: '支配' },
])

// 模拟动漫数据
const collectedAnimes = ref([
  { id: 1, title: '进击的巨人', score: '9.8', img: 'https://picsum.photos/200/300?4', tag: '战斗' },
  { id: 2, title: '葬送的芙莉莲', score: '9.9', img: 'https://picsum.photos/200/300?15', tag: '治愈' },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 py-12 min-h-screen">

    <div class="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-gray-800 pb-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-3 h-8 bg-[#1E88E5]"></div>
          <h1 class="text-5xl font-black italic tracking-tighter text-gray-900 leading-none">
            ARCHIVES
          </h1>
        </div>
        <p class="text-sm font-bold text-gray-400 tracking-[0.3em] uppercase pl-6">
          我的收藏 · 个人数据库
        </p>
      </div>

      <div class="relative w-64 h-12 border-2 border-gray-200 bg-white/50 backdrop-blur-sm p-1 flex items-center rounded-sm shadow-sm">

        <div
            class="absolute top-1 bottom-1 w-[calc(50%-6px)] bg-gray-900 shadow-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-sm flex items-center justify-center"
            :class="activeTab === 'character' ? 'left-1' : 'left-[calc(50%+2px)]'"
        >

        </div>

        <button
            @click="activeTab = 'character'"
            class="flex-1 relative z-10 h-full text-xs font-black italic tracking-widest transition-colors duration-300"
            :class="activeTab === 'character' ? 'text-white' : 'text-gray-400 hover:text-gray-600'"
        >
          角色
        </button>

        <button
            @click="activeTab = 'anime'"
            class="flex-1 relative z-10 h-full text-xs font-black italic tracking-widest transition-colors duration-300"
            :class="activeTab === 'anime' ? 'text-white' : 'text-gray-400 hover:text-gray-600'"
        >
          番剧
        </button>
      </div>
    </div>

    <transition name="fade" mode="out-in">

      <div v-if="activeTab === 'character'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <CharacterCard
            v-for="char in characters"
            :key="char.id"
            :name="char.name"
            :source="char.source"
            :image="char.img"
            :tag="char.tag"
        />


      </div>

      <div v-else-if="collectedAnimes.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <AnimeCard
            v-for="anime in collectedAnimes"
            :key="anime.id"
            :title="anime.title"
            :score="anime.score"
            :image="anime.img"
            :tag="anime.tag"
        />
      </div>

      <div v-else class="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-sm bg-white/20 backdrop-blur-sm">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <h3 class="text-xl font-black italic text-gray-800 tracking-widest mb-1">NO DATA FOUND</h3>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">暂无收藏记录</p>
      </div>

    </transition>
  </div>
</template>