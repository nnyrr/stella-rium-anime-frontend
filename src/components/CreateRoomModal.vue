<script setup>
import { ref } from 'vue'
import { createRoom } from '@/api/anime'
import { showErrorToast } from '@/utils/toast.js' // 假设你有这个工具，如果没有可用 alert

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'created'])
const userInfo = ref(null)
const form = ref({
  title: '',
  animeId: '',
  password: '',
  userId: ''
})
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!form.value.title || !form.value.animeId) {
    showErrorToast('请填写完整的房间信息')
    return
  }
  const storedInfo = localStorage.getItem('userInfo')
  if (storedInfo) {
    try {
      userInfo.value = JSON.parse(storedInfo)
    } catch (e) {
      console.error('解析用户信息失败', e)
      localStorage.removeItem('userInfo') // 清除无效数据
    }
  } else {
    userInfo.value = null
    showErrorToast("请先登录！")
    return
  }
  isLoading.value = true
  form.value.userId = userInfo.userId
  try {
    // 调用 anime.js 中的 createRoom
    const res = await createRoom(form.value.title, form.value.animeId, form.value.password, form.value.userId)
    // 假设后端返回结构 { code: 200, data: { id: 1001, ... } }
    if (res.code === 200) {
      emit('created', res.data) // 将新房间数据传出去，或者只传 id
      handleClose()
    } else {
      showErrorToast(res.msg || '创建失败')
    }
  } catch (e) {
    console.error(e)
    showErrorToast('网络错误')
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  form.value = { title: '', animeId: '', password: '', userId: '' }
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose"></div>

    <div class="relative w-full max-w-md bg-[#15171C]/90 border border-gray-700 rounded-sm p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200">
      <div class="mb-6 border-b border-gray-700 pb-4 flex justify-between items-center">
        <h2 class="text-2xl font-black italic text-white tracking-wider">CREATE PARTY</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Room Title</label>
          <input v-model="form.title" type="text" placeholder="给房间起个名字..." class="w-full bg-black/40 border border-gray-700 text-white px-4 py-3 rounded-sm focus:border-[#1E88E5] focus:outline-none transition-colors" />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Anime ID</label>
          <input v-model="form.animeId" type="number" placeholder="输入关联的动漫ID" class="w-full bg-black/40 border border-gray-700 text-white px-4 py-3 rounded-sm focus:border-[#1E88E5] focus:outline-none transition-colors" />
          <p class="text-[10px] text-gray-500 mt-1">请确保输入正确的动漫 ID 以便加载资源</p>
        </div>

        <button
            @click="handleSubmit"
            :disabled="isLoading"
            class="w-full mt-4 bg-[#1E88E5] hover:bg-blue-600 text-white font-bold py-3 rounded-sm transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>LAUNCH SYSTEM</span>
        </button>
      </div>
    </div>
  </div>
</template>