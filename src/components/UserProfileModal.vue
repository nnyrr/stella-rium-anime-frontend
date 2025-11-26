<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/anime.js'
import { showErrorToast, showSuccessToast } from '@/utils/toast.js'

// 定义 Props 和 Emits
const props = defineProps({
  initialUserId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'logout'])

const loading = ref(true)
const profile = ref({
  userId: '',
  username: '',
  nickname: '',
  email: '',
  image: '',
  bangumiId: '',
  createTime: ''
})

// 获取用户信息
const fetchUserProfile = async (id) => {
  try {
    loading.value = true
    const res = await getUserInfo(id)

    // 假设后端返回结构符合标准 Result<T>
    if (res.code === 200 || res.code === '200') {
      profile.value = res.data
    } else {
      showErrorToast(res.code, res.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息网络错误:', error)
    showErrorToast('500', '无法连接至档案数据库')
  } finally {
    loading.value = false
  }
}

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  showSuccessToast('200', '已断开系统连接')
  emit('logout')
  emit('close')
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return dateStr.split('T')[0] // 简单截取 YYYY-MM-DD
}

// 组件挂载时调用 API
onMounted(() => {
  if (props.initialUserId) {
    fetchUserProfile(props.initialUserId)
  }
})
</script>

<template>
  <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all"
      @click.self="$emit('close')"
  >
    <div class="relative bg-white/95 backdrop-blur-xl w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white overflow-hidden animate-modal-in mx-4">

      <div class="absolute -top-6 -right-6 text-[8rem] font-black italic text-gray-50 select-none pointer-events-none opacity-60 z-0 writing-vertical-rl">
        档案
      </div>

      <button @click="$emit('close')" class="absolute top-6 right-6 z-20 group p-2">
        <svg class="w-6 h-6 text-gray-300 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="relative z-10 mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="h-[3px] w-8 bg-[#1E88E5]"></div>
          <span class="text-[#1E88E5] font-bold tracking-[0.2em] text-xs">指挥官数据</span>
        </div>
        <h2 class="text-4xl font-black italic tracking-widest text-gray-900 leading-tight">
          个人中心
        </h2>
      </div>

      <div v-if="loading" class="py-20 flex flex-col items-center justify-center relative z-10">
        <svg class="animate-spin h-10 w-10 text-[#1E88E5] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xs font-black tracking-widest text-gray-400 animate-pulse">LOADING PROFILE...</span>
      </div>

      <div v-else class="relative z-10 space-y-6 animate-fade-in-down">

        <div class="flex items-center gap-5">
          <div class="relative w-24 h-24 shrink-0 group">
            <div class="absolute inset-0 rounded-full bg-[#1E88E5] opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
            <img
                :src="profile.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'"
                class="relative w-full h-full rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                alt="Avatar"
            >
            <div class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
          </div>

          <div class="overflow-hidden">
            <h3 class="text-2xl font-black text-gray-800 tracking-tight truncate">{{ profile.nickname }}</h3>
            <p class="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">@{{ profile.username }}</p>
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1E88E5]/10 border border-[#1E88E5]/20">
              <span class="text-[10px] font-bold text-[#1E88E5]">UID: {{ profile.userId }}</span>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div class="space-y-4">

          <div class="group">
            <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1">邮箱 / EMAIL</label>
            <div class="w-full bg-gray-50 text-gray-700 font-bold px-4 py-3 rounded-lg border border-transparent select-text">
              {{ profile.email || '未绑定邮箱' }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1">Bangumi ID</label>
              <div class="w-full bg-pink-50/50 text-pink-600 font-black px-4 py-3 rounded-lg border border-pink-100/50 truncate">
                {{ profile.bangumiId || 'N/A' }}
              </div>
            </div>

            <div class="group">
              <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1">注册日期 / DATE</label>
              <div class="w-full bg-gray-50 text-gray-600 font-bold px-4 py-3 rounded-lg border border-transparent">
                {{ formatDate(profile.createTime) }}
              </div>
            </div>
          </div>

        </div>

        <div class="pt-2 flex gap-4">
          <button
              @click="handleLogout"
              class="flex-1 py-3.5 rounded-lg border-2 border-red-50 text-red-400 text-sm font-black italic tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors duration-300"
          >
            退出登录
          </button>

          <button
              class="flex-[1.5] group relative overflow-hidden bg-[#1E88E5] text-white py-3.5 rounded-lg shadow-lg shadow-blue-200 hover:shadow-blue-400/40 transition-all duration-300 active:scale-[0.98]"
          >
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span class="text-sm font-black italic tracking-[0.2em] indent-[0.2em] group-hover:tracking-[0.3em] transition-all">
              编辑资料
            </span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* 复用 LoginModal 的动画 */
@keyframes modalIn {
  0% { opacity: 0; transform: scale(0.9) translateY(20px); }
  60% { transform: scale(1.02) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-modal-in {
  animation: modalIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}
</style>