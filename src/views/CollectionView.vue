<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import AnimeCard from '@/components/AnimeCard.vue'
import CharacterCard from '@/components/CharacterCard.vue'
import { getAnimeCollection, getCharacterCollection } from "@/api/anime.js";
import { showErrorToast } from "@/utils/toast.js";

const activeTab = ref('character')
const userInfo = ref(null)

// --- 公共分页状态 ---
// 两个 Tab 共用一套分页变量，切换 Tab 时重置
const pageSize = ref(20)
const currentPage = ref(1)

// --- 番剧独有的筛选状态 ---
const currentStatus = ref(0) // 0:全部, 1:想看, 2:看过, 3:在看, 4:搁置, 5:抛弃

const statusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '想看' },
  { value: 2, label: '看过' },
  { value: 3, label: '在看' },
  { value: 4, label: '搁置' },
  { value: 5, label: '抛弃' }
]

// 数据源
const characters = ref([])
const collectedAnimes = ref([])

// --- 分页逻辑 (通用) ---
const showJumpInput = ref(false)
const jumpPageInput = ref(null)
const jumpValue = ref('')

const displayedPages = computed(() => {
  const current = currentPage.value
  const pages = []
  // 显示当前页的前2页和后2页
  for (let i = Math.max(1, current - 2); i <= current + 2; i++) {
    pages.push(i)
  }
  return pages
})

const activateJump = () => {
  showJumpInput.value = true
  jumpValue.value = ''
  nextTick(() => {
    jumpPageInput.value?.focus()
  })
}

const handleJumpSubmit = () => {
  const p = parseInt(jumpValue.value)
  if (p && p > 0) {
    currentPage.value = p
  }
  showJumpInput.value = false
}

// --- 业务逻辑 ---

const goToDetail = (id) => {
  if (id) {
    const url = `https://bgm.tv/character/${id}`
    window.open(url, '_blank')
  } else {
    alert('未获取到ID')
  }
}

const goToCharacterDetail = (id) => {
  if (id) {
    const url = `https://bgm.tv/subject/${id}`
    window.open(url, '_blank')
  } else {
    alert('未获取到ID')
  }
}

const checkLoginStatus = () => {
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
    showErrorToast('400', '请登录以获取收藏')
  }
}

// 获取角色收藏 (带分页)
const fetchCharacters = async () => {
  if (!userInfo.value) return
  try {
    // 注意：这里假设后端接口和 anime.js 已经支持传参 (userId, pageSize, currentPage)
    // 如果 anime.js 未更新，请记得去修改 getCharacterCollection 函数以接收这些参数
    const res = await getCharacterCollection(
        userInfo.value.userId,
        pageSize.value,
        currentPage.value
    )
    if (res?.data?.list) {
      characters.value = res.data.list.map(item => ({
        id: item.bangumiId,
        name: item.nameCn || item.name,
        source: item.from || 'N/A',
        img: item.image,
        tag: item.tag || '人物'
      }))
    } else {
      characters.value = []
    }
  } catch (e) {
    console.error("角色获取失败", e)
    characters.value = []
  }
}

// 获取番剧收藏 (带分页和筛选)
const fetchAnimes = async () => {
  if (!userInfo.value) return
  try {
    const res = await getAnimeCollection(
        userInfo.value.userId,
        currentStatus.value,
        pageSize.value,
        currentPage.value
    )

    if (res?.data?.list) {
      collectedAnimes.value = res.data.list.map(item => ({
        id: item.bangumiId,
        title: item.nameCn || item.name,
        score: item.rating || 'N/A',
        img: item.image,
        year: item.year,
        tag: item.tag || '动漫'
      }))
    } else {
      collectedAnimes.value = []
    }
  } catch (e) {
    console.error("番剧获取失败", e)
    collectedAnimes.value = []
  }
}

const handleStatusClick = (statusVal) => {
  if (currentStatus.value !== statusVal) {
    currentStatus.value = statusVal
    currentPage.value = 1 // 切换筛选重置页码
  }
}

// 监听 Tab 切换
watch(activeTab, (newTab) => {
  // 切换 Tab 时重置分页状态
  currentPage.value = 1
  showJumpInput.value = false

  if (newTab === 'character') {
    fetchCharacters()
  } else {
    fetchAnimes()
  }
})

// 监听分页变化 (统一处理)
watch([currentPage, pageSize], () => {
  if (activeTab.value === 'character') {
    fetchCharacters()
  } else {
    fetchAnimes()
  }
})

// 监听番剧状态变化 (独立监听，因为只有番剧有这个)
watch(currentStatus, () => {
  if (activeTab.value === 'anime') {
    fetchAnimes()
  }
})

onMounted(() => {
  checkLoginStatus()
  if (activeTab.value === 'character') {
    fetchCharacters()
  } else {
    fetchAnimes()
  }
})
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
        ></div>

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

      <div :key="activeTab" class="w-full flex flex-col gap-6">

        <div v-if="activeTab === 'anime'" class="flex flex-wrap items-center gap-2 pb-4  border-gray-100">
          <div class="text-xs font-black text-gray-400 tracking-wider mr-2">STATUS:</div>
          <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="handleStatusClick(status.value)"
              class="relative py-1.5 px-4 text-xs font-bold rounded-sm transition-all duration-300 border group"
              :class="currentStatus === status.value
                ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)]'
                : 'bg-white/40 border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'"
          >
            {{ status.label }}
            <div v-if="currentStatus === status.value" class="absolute bottom-0 right-0 w-0 h-0 border-b-[5px] border-r-[5px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[5px] border-l-transparent border-t-[5px] border-t-transparent opacity-80"></div>
          </button>
        </div>

        <div v-if="(activeTab === 'character' && characters.length > 0) || (activeTab === 'anime' && collectedAnimes.length > 0)"
             class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 min-h-[400px]">

          <template v-if="activeTab === 'character'">
            <CharacterCard
                v-for="char in characters"
                :key="char.id"
                :name="char.name"
                :source="char.source"
                :image="char.img"
                :tag="char.tag"
                @click="goToCharacterDetail(char.id)"
            />
          </template>

          <template v-else>
            <AnimeCard
                v-for="anime in collectedAnimes"
                :key="anime.id"
                :title="anime.title"
                :score="anime.score"
                :image="anime.img"
                :tag="anime.tag"
                :year="anime.year"
                @click="goToDetail(anime.id)"
            />
          </template>
        </div>

        <div v-else class="flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center border-4 border-dashed border-gray-200 rounded-xl bg-white/20 backdrop-blur-sm">

          <h3 class="text-4xl font-black italic text-gray-800 tracking-widest mb-3">NO DATA FOUND</h3>
          <p class="text-lg font-bold text-gray-400 uppercase tracking-[0.2em]">
            {{ activeTab === 'character' ? '暂无角色收藏' : '该分类下暂无番剧' }}
          </p>
          <p class="text-xs text-gray-300 mt-4 font-mono">TRY CHANGING FILTERS OR ADD NEW ITEMS</p>
        </div>

        <div v-if="(activeTab === 'character' && characters.length > 0) || (activeTab === 'anime' && collectedAnimes.length > 0)"
             class="mt-6 flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-300/50">

          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">PER PAGE</span>
            <div class="relative group">
              <select v-model="pageSize" class="appearance-none bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 font-bold text-xs pl-3 pr-8 py-1.5 rounded-sm focus:outline-none focus:border-[#1E88E5] transition-all cursor-pointer hover:border-[#1E88E5]">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="30">30</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2 select-none">
            <button
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="w-9 h-9 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                class="relative w-9 h-9 rounded-sm font-bold text-xs transition-all duration-300 border flex items-center justify-center group"
                :class="currentPage === page
        ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)] z-10 scale-105'
        : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-white/50'"
            >
              {{ page }}
              <div v-if="currentPage === page"
                   class="absolute bottom-0 right-0 w-0 h-0 border-b-[5px] border-r-[5px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[5px] border-l-transparent border-t-[5px] border-t-transparent opacity-80">
              </div>
            </button>

            <div class="relative w-9 h-9">
              <input
                  v-if="showJumpInput"
                  ref="jumpPageInput"
                  v-model="jumpValue"
                  type="number"
                  @blur="showJumpInput = false"
                  @keyup.enter="handleJumpSubmit"
                  class="absolute inset-0 w-full h-full text-center text-xs font-bold text-[#1E88E5] bg-white border border-[#1E88E5] rounded-sm outline-none shadow-[0_0_10px_rgba(30,136,229,0.2)]"
                  placeholder="GO"
              />
              <button
                  v-else
                  @click="activateJump"
                  class="w-full h-full flex items-center justify-center text-gray-300 font-black tracking-widest hover:text-[#1E88E5] transition-colors cursor-pointer"
                  title="跳转"
              >
                ...
              </button>
            </div>

            <button
                @click="currentPage++"
                class="w-9 h-9 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

      </div>

    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>