<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)

const handleLogin = () => router.push('/')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/30 blur-3xl animate-pulse" style="animation-delay: 1s"></div>

    <div class="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white relative z-10">
      <div class="text-center mb-10">
        <div class="inline-block p-3 rounded-xl bg-blue-50 text-[#1E88E5] mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">{{ isLogin ? '欢迎回来' : '创建账号' }}</h1>
        <p class="text-gray-400 text-sm mt-2">开启你的二次元探索之旅</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="space-y-1">
          <input type="email" placeholder="邮箱地址" class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all" />
        </div>
        <div class="space-y-1">
          <input type="password" placeholder="密码" class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all" />
        </div>

        <button class="w-full bg-gradient-to-r from-[#1E88E5] to-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300">
          {{ isLogin ? '立即登录' : '注册账号' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <button @click="isLogin = !isLogin" class="text-sm text-gray-500 hover:text-[#1E88E5] transition">
          {{ isLogin ? '还没有账号？去注册' : '已有账号？去登录' }}
        </button>
      </div>
    </div>
  </div>
</template>