<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { showErrorToast } from "@/utils/toast.js"; //

const props = defineProps({
  roomId: { type: String, required: true },
  animeTitle: { type: String, default: '' },
  playerInstance: { type: Object, default: null }
})

// 【新增 1】定义事件，用于通知父组件切换集数
const emit = defineEmits(['change-episode'])

// --- WebSocket 状态 ---
const socket = ref(null)
const isConnected = ref(false)
const heartbeatTimer = ref(null)
const userInfo = ref(null)

// --- 聊天相关 ---
const isExpanded = ref(true)
const messages = ref([])
const inputMsg = ref('')

// --- 同步控制标志位 ---
let isRemoteUpdate = false

// 初始化 WebSocket
const initWebSocket = () => {
  const storedInfo = localStorage.getItem('userInfo')
  if (storedInfo) {
    try {
      userInfo.value = JSON.parse(storedInfo)
    } catch (e) {
      console.error('解析用户信息失败', e)
      localStorage.removeItem('userInfo')
    }
  } else {
    userInfo.value = null
    showErrorToast("请先登录！")
    return
  }

  // 环境变量或默认 Host
  const wsHost = import.meta.env.VITE_WS_HOST || window.location.host
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${wsProtocol}//${wsHost}/together/ws/${props.roomId}`

  socket.value = new WebSocket(wsUrl)

  socket.value.onopen = () => {
    console.log('WS Connected')
    isConnected.value = true

    if (userInfo.value && userInfo.value.userId) {
      sendAction('HEARTBEAT', { userId: userInfo.value.userId })
    }

    startHeartbeat()
    messages.value.push({ type: 'system', text: '已连接到同步服务器' })
  }

  socket.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      handleWsMessage(data)
    } catch (e) {
      console.error('WS Parse Error', e)
    }
  }

  socket.value.onclose = () => {
    console.log('WS Closed')
    isConnected.value = false
    stopHeartbeat()
    messages.value.push({ type: 'system', text: '连接断开，正在尝试重连...' })
    setTimeout(initWebSocket, 3000)
  }
}

// 消息处理分发中心
const handleWsMessage = (data) => {
  const { type, payload } = data
  const player = props.playerInstance

  switch (type) {
    case 'CHAT_NEW':
      messages.value.push({
        id: Date.now(),
        user: payload.username || 'User',
        text: payload.content,
        type: 'user'
      })
      break

    case 'SYNC_PAUSE':
      if (player) {
        isRemoteUpdate = true
        if (Math.abs(player.currentTime - payload.currentTime) > 0.5) {
          player.currentTime = payload.currentTime
        }
        player.pause()
        messages.value.push({ type: 'system', text: '房主暂停了视频' })
        setTimeout(() => { isRemoteUpdate = false }, 500)
      }
      break

    case 'SYNC_PLAY':
      if (player) {
        isRemoteUpdate = true
        if (Math.abs(player.currentTime - payload.currentTime) > 1) {
          player.currentTime = payload.currentTime
        }
        player.play()
        setTimeout(() => { isRemoteUpdate = false }, 500)
      }
      break

    case 'SYNC_SEEK':
      if (player) {
        isRemoteUpdate = true
        player.currentTime = payload.currentTime
        messages.value.push({ type: 'system', text: `跳转至 ${formatTime(payload.currentTime)}` })
        setTimeout(() => { isRemoteUpdate = false }, 500)
      }
      break

    case 'SYNC_SPEED':
      if(player) {
        isRemoteUpdate = true
        player.playbackRate = payload.rate
        setTimeout(() => { isRemoteUpdate = false }, 500)
      }
      break

      // 【新增 2】 处理服务端下发的切集指令
    case 'SYNC_EPISODE':
      // 通知父组件去切换集数 (Payload 需包含目标集数信息，如 sort 或 id)
      messages.value.push({ type: 'system', text: `房主切换到了第 ${payload.sort || '?'} 集` })
      emit('change-episode', payload)
      break
  }
}

// 发送指令封装
const sendAction = (type, payload = {}) => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({ type, payload }))
  }
}

// 【新增 3】 暴露给父组件的方法：主动通知切换集数
const syncEpisodeChange = (episodeData) => {
  // 发送 EPISODE_CHANGE 消息给后端
  sendAction('EPISODE_CHANGE', {
    // 根据你的后端需求传递参数，比如：
    sort: episodeData.sort,
    url: episodeData.url,
    title: episodeData.title
  })
}

// 暴露方法给父组件引用
defineExpose({
  syncEpisodeChange
})

// --- 播放器事件绑定 ---
const bindPlayerEvents = (player) => {
  if (!player) return

  player.on('play', () => {
    if (!isRemoteUpdate) {
      sendAction('VIDEO_PLAY', { currentTime: player.currentTime })
    }
  })

  player.on('pause', () => {
    if (!isRemoteUpdate) {
      sendAction('VIDEO_PAUSE', { currentTime: player.currentTime })
    }
  })

  player.on('seek', (time) => {
    if (!isRemoteUpdate) {
      sendAction('VIDEO_SEEK', { currentTime: time })
    }
  })

  player.on('video:ratechange', () => {
    if(!isRemoteUpdate) {
      sendAction('VIDEO_RATE', { rate: player.playbackRate })
    }
  })
}

// --- 聊天 UI 逻辑 ---
const toggleExpand = () => isExpanded.value = !isExpanded.value
const sendMessage = () => {
  if (!inputMsg.value.trim()) return
  sendAction('CHAT_SEND', { content: inputMsg.value })
  messages.value.push({ id: Date.now(), user: '我', text: inputMsg.value, type: 'user' })
  inputMsg.value = ''
}

// --- 生命周期 & Watch ---
const startHeartbeat = () => {
  stopHeartbeat()
  heartbeatTimer.value = setInterval(() => {
    if (userInfo.value && userInfo.value.userId) {
      sendAction('HEARTBEAT', {userId: userInfo.value.userId})
    }
  }, 30000)
}

const stopHeartbeat = () => {
  if (heartbeatTimer.value) clearInterval(heartbeatTimer.value)
}

watch(() => props.playerInstance, (newPlayer) => {
  if (newPlayer) {
    console.log('ArtPlayer attached to Sync System')
    bindPlayerEvents(newPlayer)
  }
})

onMounted(() => {
  if (props.roomId) {
    initWebSocket()
  }
})

onUnmounted(() => {
  if (socket.value) socket.value.close()
  stopHeartbeat()
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0'+s : s}`
}
</script>

<template>
  <div class="fixed z-50 transition-all duration-300 ease-in-out"
       :class="[isExpanded ? 'bottom-4 right-4 w-80 h-[500px] shadow-2xl' : 'bottom-8 right-8 w-14 h-14 rounded-full shadow-lg hover:scale-110 cursor-pointer']">

    <div v-if="!isExpanded" @click="toggleExpand" class="w-full h-full bg-[#1E88E5] rounded-full flex items-center justify-center text-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
    </div>

    <div v-else class="w-full h-full flex flex-col bg-[#15171C]/95 backdrop-blur-md rounded-sm border border-gray-700 overflow-hidden">
      <div class="flex items-center justify-between p-3 border-b border-gray-700 bg-[#0B0C10]">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'"></div>
          <span class="text-xs font-bold text-gray-300 tracking-wider">ROOM CHAT</span>
        </div>
        <button @click="toggleExpand" class="text-gray-500 hover:text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div v-for="msg in messages" :key="msg.id" class="flex flex-col text-sm" :class="msg.type === 'system' ? 'items-center' : (msg.user === '我' ? 'items-end' : 'items-start')">
          <span v-if="msg.type !== 'system' && msg.user !== '我'" class="text-[10px] text-gray-500 mb-0.5 ml-1">{{ msg.user }}</span>

          <div v-if="msg.type === 'system'" class="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full mb-2">
            {{ msg.text }}
          </div>

          <div v-else class="px-3 py-2 max-w-[85%] break-words rounded-sm"
               :class="msg.user === '我' ? 'bg-[#1E88E5] text-white' : 'bg-gray-800 text-gray-200'">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-gray-700 bg-[#0B0C10]">
        <div class="flex gap-2">
          <input v-model="inputMsg"
                 @keyup.enter="sendMessage"
                 placeholder="一起吐槽吧..."
                 class="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:border-[#1E88E5] focus:outline-none transition-colors"
          />
          <button @click="sendMessage" class="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-3 py-2 rounded transition-colors flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>