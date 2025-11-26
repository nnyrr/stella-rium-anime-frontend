<script setup>
import { ref, reactive, nextTick } from 'vue'
import { showErrorToast, showSuccessToast } from '@/utils/toast.js'
import { login, register, uploadFile, deleteFile } from "@/api/anime.js"
import Turnstile from "@/components/Turnstile.vue"

const emit = defineEmits(['close', 'success'])
const siteKey = '0x4AAAAAACCiq1BeceX4h8va'

// 状态
const isLogin = ref(true)
const isLoading = ref(false)
const isUploading = ref(false) // 上传状态 loading
const turnstileToken = ref('')
const turnstileRef = ref(null)

// 隐藏的文件输入框引用
const fileInputRef = ref(null)

// 表单数据
const form = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
  bangumiId: '',
  avatar: '',     // 存储图片 URL (用于显示)
  avatarUuid: ''  // 存储图片 UUID (用于删除)
})

// 切换模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
  // 清空字段
  form.email = ''
  form.nickname = ''
  form.bangumiId = ''

  // 切换模式时，建议重置头像状态。
  // 注意：如果用户已经上传了图片但没注册就切换了，
  // 这里是否自动删除取决于业务逻辑。为了简单，这里只清空前端状态。
  form.avatar = ''
  form.avatarUuid = ''

  turnstileToken.value = ''
  nextTick(() => {
    if(turnstileRef.value) turnstileRef.value.reset()
  })
}

// --- 文件上传逻辑 ---

// 触发文件选择
const triggerFileUpload = () => {
  fileInputRef.value.click()
}

// 处理文件选择改变
const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 1. 校验文件大小 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showErrorToast('400', '图片大小不能超过 2MB')
    // 清空 input，否则下次选同一个文件不会触发 change
    e.target.value = ''
    return
  }

  isUploading.value = true
  try {
    // 2. 如果当前已经有一张图片，先删除旧的，防止服务器堆积无用文件
    // (这就是你要求的“删除当前删除的文件”逻辑)
    if (form.avatarUuid) {
      await deleteFile(form.avatarUuid)
    }

    // 3. 上传新文件
    // 后端返回结构: { "uuid": "string", "image": "string" }
    const res = await uploadFile(file)

    // 4. 更新本地存储
    // 根据你的 request.js 拦截器，res 应该是 response.data
    form.avatar = res.data.image      // 用于显示预览
    form.avatarUuid = res.data.uuid   // 记录 UUID 用于后续删除

    showSuccessToast('200', '头像上传成功')
  } catch (error) {
    console.error(error)
  } finally {
    isUploading.value = false
    e.target.value = '' // 重置 input，允许重复上传同一文件
  }
}

// 处理移除头像 (点击删除按钮)
const handleRemoveAvatar = async () => {
  if (!form.avatarUuid) {
    // 如果没有 UUID，直接清空预览即可
    form.avatar = ''
    return
  }

  try {
    // 调用接口删除云端文件
    await deleteFile(form.avatarUuid)

    // 清空本地状态
    form.avatar = ''
    form.avatarUuid = ''
    // 重置 input
    if (fileInputRef.value) fileInputRef.value.value = ''

    showSuccessToast('200', '已移除头像')
  } catch (error) {
    console.error(error)
    // 即使后端报错（比如文件不存在），前端最好也清空预览，保证 UI 正常
    form.avatar = ''
    form.avatarUuid = ''
  }
}

// --- 其他逻辑 ---

const handleVerify = (token) => {
  turnstileToken.value = token
}

const handleBackdropClick = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!turnstileToken.value) {
    showErrorToast('403', '请先完成人机验证')
    return
  }

  isLoading.value = true

  try {
    if (isLogin.value) {
      const res = await login({
        username: form.username,
        password: form.password,
        captchaToken: turnstileToken.value
      })
      showSuccessToast('200', '欢迎回来，指挥官')
      const loginData = res.data
      localStorage.setItem('userInfo', JSON.stringify(loginData))
      // userId, avatar, nickname, token
      emit('success')
      emit('close')
    } else {
      const res = await register({
        username: form.username,
        password: form.password,
        email: form.email,
        nickname: form.nickname || form.username,
        bangumiId: form.bangumiId,
        image: form.avatar, // 提交给注册接口的是图片链接
        captchaToken: turnstileToken.value
      })
      showSuccessToast('201', '注册成功，请登录')
      toggleMode()
    }
  } catch (error) {
    if(turnstileRef.value) turnstileRef.value.reset()
    turnstileToken.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all"
      @click.self="handleBackdropClick"
  >
    <div class="relative bg-white/95 backdrop-blur-xl w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white overflow-hidden animate-modal-in mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">

      <div class="absolute -top-6 -right-6 text-[8rem] font-black italic text-gray-50 select-none pointer-events-none opacity-60 z-0 writing-vertical-rl">
        {{ isLogin ? '登入' : '注册' }}
      </div>

      <button @click="$emit('close')" class="absolute top-6 right-6 z-20 group p-2">
        <svg class="w-6 h-6 text-gray-300 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="relative z-10 mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="h-[3px] w-8 bg-[#1E88E5]"></div>
          <span class="text-[#1E88E5] font-bold tracking-[0.2em] text-xs">系统接入许可</span>
        </div>
        <h2 class="text-4xl font-black italic tracking-widest text-gray-900 leading-tight mb-2">
          {{ isLogin ? '欢迎来访' : '新人报道' }}
        </h2>
      </div>

      <form @submit.prevent="handleSubmit" class="relative z-10 space-y-5">

        <div class="group">
          <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5]">账户 / USERNAME</label>
          <div class="relative">
            <input v-model="form.username" type="text" required class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal" placeholder="请输入用户名" />
            <div class="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1E88E5] transition-all duration-500 group-focus-within:w-full"></div>
          </div>
        </div>

        <div class="group">
          <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5]">密码 / PASSWORD</label>
          <div class="relative">
            <input v-model="form.password" type="password" required class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="!isLogin" class="space-y-5 animate-fade-in-down">
          <div class="group">
            <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5]">邮箱 / EMAIL</label>
            <input v-model="form.email" type="email" required class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal" placeholder="name@example.com" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5]">昵称 / NICKNAME</label>
              <input v-model="form.nickname" type="text" class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal" placeholder="显示昵称（可重复）"/>
            </div>

            <div class="group">
              <label class="block text-xs font-black text-gray-400 tracking-wider mb-2 ml-1">头像 / AVATAR</label>

              <input
                  type="file"
                  ref="fileInputRef"
                  class="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  @change="handleFileChange"
              />

              <div class="flex items-start gap-4">
                <div
                    class="relative w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1E88E5] transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 group/avatar"
                    @click="!form.avatar ? triggerFileUpload() : null"
                >
                  <div v-if="isUploading" class="absolute inset-0 z-20 bg-white/80 flex items-center justify-center">
                    <svg class="animate-spin h-6 w-6 text-[#1E88E5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>

                  <template v-if="form.avatar">
                    <img :src="form.avatar" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-10">
                      <button @click.stop="triggerFileUpload" class="text-white text-[10px] font-bold hover:text-[#1E88E5] px-2 py-0.5 rounded backdrop-blur-sm bg-black/20">更换</button>
                      <button @click.stop="handleRemoveAvatar" class="text-red-400 text-[10px] font-bold hover:text-red-200 px-2 py-0.5 rounded backdrop-blur-sm bg-black/20">删除</button>
                    </div>
                  </template>

                  <template v-else>
                    <div class="flex flex-col items-center text-gray-400 group-hover:text-[#1E88E5] transition-colors">
                      <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      <span class="text-[9px] font-bold">UPLOAD</span>
                    </div>
                  </template>
                </div>

                <div class="flex-1 text-xs text-gray-400 pt-1">
                  <p class="leading-relaxed">
                    支持 JPG, PNG<br/>
                    <span class="text-[#1E88E5]/80">推荐正方形</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
          <div class="group">
            <label class="block text-xs font-black text-gray-400 tracking-wider mb-1 ml-1 group-focus-within:text-[#1E88E5]">Bangumi ID</label>
            <input v-model="form.bangumiId" type="text" class="w-full bg-gray-100 text-gray-800 font-bold px-4 py-3 rounded-lg border-b-4 border-transparent focus:border-[#1E88E5] focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal" placeholder="显示在bangumi名字旁边的@xxx" />
          </div>

        </div>

        <div class="flex justify-center pt-2 min-h-[65px]">
          <Turnstile ref="turnstileRef" :siteKey="siteKey" @verify="handleVerify" />
        </div>

        <button :disabled="isLoading" class="w-full group relative overflow-hidden bg-[#1E88E5] text-white py-4 rounded-lg shadow-lg shadow-blue-200 hover:shadow-blue-400/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          <div class="relative flex items-center justify-center gap-2">
            <span v-if="isLoading" class="text-lg font-black italic tracking-widest animate-pulse">PROCESSING...</span>
            <span v-else class="text-lg font-black italic tracking-[0.2em] indent-[0.2em] transition-all duration-300 group-hover:tracking-[0.5em] group-hover:indent-[0.5em]">
              {{ isLogin ? '执行认证' : '立即启动' }}
            </span>
          </div>
        </button>
      </form>

      <div class="relative z-10 mt-6 text-center">
        <p class="text-xs font-bold text-gray-400 tracking-wide">
          {{ isLogin ? '还没有通行证?' : '已有现有账户?' }}
          <button @click="toggleMode" class="text-[#1E88E5] hover:text-gray-900 ml-1 transition-colors relative group/link inline-block font-black">
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
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.1); border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(30, 136, 229, 0.5); }
</style>