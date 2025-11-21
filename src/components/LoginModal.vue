<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const isLogin = ref(true)

const handleBackdropClick = () => {
  emit('close')
}

const handleSubmit = () => {
  // 登录逻辑...
  emit('close')
}
</script>

<template>
  <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all"
      @click.self="handleBackdropClick"
  >
    <div class="relative bg-white/95 backdrop-blur-xl w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white overflow-hidden animate-modal-in mx-4">

      <div class="absolute -top-6 -right-6 text-[8rem] font-black italic text-gray-50 select-none pointer-events-none opacity-60 z-0 writing-vertical-rl">
        {{ isLogin ? '登入' : '注册' }}
      </div>

      <button
          @click="$emit('close')"
          class="absolute top-6 right-6 z-20 group p-2"
      >
        <svg class="w-6 h-6 text-gray-300 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="relative z-10 mb-10">
        <div class="flex items-center gap-3 mb-2">
          <div class="h-[3px] w-8 bg-[#1E88E5]"></div>
          <span class="text-[#1E88E5] font-bold tracking-[0.2em] text-xs">系统接入许可</span>
        </div>

        <h2 class="text-4xl font-black italic tracking-widest text-gray-900 leading-tight mb-2">
          {{ isLogin ? '欢迎来访' : '新人报道' }}
        </h2>
        <p class="text-gray-400 font-bold tracking-[0.1em] text-xs">
          {{ isLogin ? '正在建立安全连接...' : '申请您的二次元通行证' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="relative z-10 space-y-6">

        <div class="group">
          <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5] transition-colors">账户 / 邮箱</label>
          <div class="relative">
            <input
                type="email"
                class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3.5 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal"
                placeholder="name@example.com"
            />
            <div class="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1E88E5] transition-all duration-500 group-focus-within:w-full"></div>
          </div>
        </div>

        <div class="group">
          <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5] transition-colors">密码</label>
          <div class="relative">
            <input
                type="password"
                class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3.5 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal"
                placeholder="••••••••"
            />
          </div>
        </div>

        <button
            class="w-full group relative overflow-hidden bg-[#1E88E5] text-white py-4 rounded-lg shadow-lg shadow-blue-200 hover:shadow-blue-400/40 transition-all duration-300 active:scale-[0.98]"
        >
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

          <div class="relative flex items-center justify-center gap-2">
            <span class="text-lg font-black italic tracking-[0.2em] indent-[0.2em] transition-all duration-300 group-hover:tracking-[0.5em] group-hover:indent-[0.5em]">
              {{ isLogin ? '执行认证' : '立即启动' }}
            </span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </div>
        </button>
      </form>

      <div class="relative z-10 mt-8 text-center">
        <p class="text-xs font-bold text-gray-400 tracking-wide">
          {{ isLogin ? '还没有通行证?' : '已有现有账户?' }}
          <button
              @click="isLogin = !isLogin"
              class="text-[#1E88E5] hover:text-gray-900 ml-1 transition-colors relative group/link inline-block font-black"
          >
            {{ isLogin ? '注册新账号' : '直接登录' }}
            <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1E88E5] transition-all duration-300 group-hover/link:w-full"></span>
          </button>
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes modalIn {
  0% { opacity: 0; transform: scale(0.9) translateY(20px); }
  60% { transform: scale(1.02) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in {
  animation: modalIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>