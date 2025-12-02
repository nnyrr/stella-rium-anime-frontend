<script setup>
// 1. 引入必要的 Vue 组合式 API
import { ref, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
// 2. 确保路径正确
import { getLibrary } from "@/api/anime.js";

const router = useRouter()

// --- 状态管理 ---
const sortBy = ref('rank')
const pageSize = ref(20)
const currentPage = ref(1)

// 筛选状态
const selectedYear = ref('全部')
const selectedSeason = ref(null)

// 数据列表
const animeList = ref([])

// [新增] 加载状态控制
const isLoading = ref(false)

const goToDetail = (id) => {
  router.push(`/player/${id}`)
  /*if (id) {
    // 使用模板字符串拼接 ID，_blank 表示新窗口打开
    const url = `https://bgm.tv/subject/${id}`
    window.open(url, '_blank')
  } else {
    alert('未获取到番剧 ID')
  }*/
}

// --- 年份筛选逻辑 ---
const presetYears = ['全部', '2024', '2023', '2022', '2021']

// 判断是否是自定义年份（更早）
const isEarlierActive = computed(() => {
  if (!selectedYear.value) return true // 如果为空，也算在自定义输入框激活状态
  return !presetYears.includes(String(selectedYear.value))
})

const handleYearClick = (year) => {
  if (year === '更早') {
    // 点击更早，如果当前已经是自定义模式，不清空；如果是预设模式，清空以便输入
    if (!isEarlierActive.value) {
      selectedYear.value = ''
    }
  } else {
    selectedYear.value = year
  }
}

// 辅助函数：计算季节
const getSeasonFromDate = (dateStr) => {
  if (!dateStr) return '未知'
  try {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    if (month >= 1 && month <= 3) return '冬'
    if (month >= 4 && month <= 6) return '春'
    if (month >= 7 && month <= 9) return '夏'
    return '秋'
  } catch (e) {
    return '未知'
  }
}

// 控制跳转输入框的显示
const showJumpInput = ref(false)
const jumpPageInput = ref(null) // 用于获取input DOM元素
const jumpValue = ref('')

// 计算显示的页码数组 (前2页 + 当前页 + 后2页)
const displayedPages = computed(() => {
  const current = currentPage.value
  const pages = []
  // 从 current-2 开始，到 current+2 结束
  for (let i = Math.max(1, current - 2); i <= current + 2; i++) {
    pages.push(i)
  }
  return pages
})

// 处理点击 ... 按钮
const activateJump = () => {
  showJumpInput.value = true
  jumpValue.value = ''
  nextTick(() => {
    jumpPageInput.value?.focus()
  })
}

// 提交跳转
const handleJumpSubmit = () => {
  const p = parseInt(jumpValue.value)
  if (p && p > 0) {
    currentPage.value = p
  }
  showJumpInput.value = false
}

// --- 核心获取数据方法 ---
const updateLibrary = async () => {
  // 1. 开启加载动画
  isLoading.value = true

  try {
    // 2. 参数清洗
    let cleanYear = undefined
    if (selectedYear.value && selectedYear.value !== '全部' && selectedYear.value !== '') {
      cleanYear = Number(selectedYear.value)
    }

    let cleanSeason = selectedSeason.value || undefined

    const params = {
      sort: sortBy.value,
      year: cleanYear,
      season: cleanSeason,
      pageSize: Number(pageSize.value),
      currentPage: Number(currentPage.value)
    }

    console.log('🚀 发起请求 参数检查:', params)

    // 3. 调用 API
    const updateRes = await getLibrary(
        params.sort,
        params.year,
        params.season,
        params.pageSize,
        params.currentPage
    )

    console.log('✅ API返回:', updateRes)

    // 4. 数据映射
    const listData = updateRes.data ? (updateRes.data.list || updateRes.data) : []

    if (Array.isArray(listData)) {
      animeList.value = listData.map(item => {
        const aliasParts = [
          item.episodes ? `${item.episodes}话` : '',
          item.director,
          item.productionCompany
        ].filter(Boolean)

        return {
          id: item.bangumiId,
          title: item.nameCn || item.name,
          alias: aliasParts.join(' / '),
          score: item.rating || 'N/A',
          rank: item.rank,
          img: item.image,
          year: item.date ? String(item.date).substring(0, 4) + '年' : '未知',
          season: getSeasonFromDate(item.date),
          tags: item.tags || []
        }
      })
    } else {
      animeList.value = []
    }
  }
  catch (error) {
    console.error("❌ 更新排行榜异常:", error)
    if (error.response) {
      console.error("后端报错详情:", error.response.data)
    }
    animeList.value = []
  }
  finally {
    // 5. 无论成功失败，关闭加载动画（加一点延迟让视觉更平滑）
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}

// 监听变化
watch(
    [sortBy, pageSize, currentPage, selectedYear, selectedSeason],
    () => {
      updateLibrary()
    },
    { immediate: true }
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-12 min-h-screen">

    <div class="w-full md:w-3/4 flex flex-col">

      <div class="flex justify-between items-end mb-8 border-b-4 border-gray-800 pb-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-3 h-8 bg-[#1E88E5]"></div>
            <h1 class="text-5xl font-black italic tracking-tighter text-gray-900 leading-none">
              LIBRARY
            </h1>
          </div>
          <p class="text-sm font-bold text-gray-400 tracking-[0.3em] uppercase pl-6">
            动漫数据库
          </p>
        </div>
        <div class="flex gap-6 text-sm font-bold tracking-widest">
          <button @click="sortBy = 'rank'" class="transition-colors hover:text-[#1E88E5]"
                  :class="sortBy === 'rank' ? 'text-[#1E88E5]' : 'text-gray-500'">
            按评分
            <span v-if="sortBy === 'rank'" class="block h-[3px] w-full bg-[#1E88E5] mt-1 rounded-full"></span>
          </button>
          <button @click="sortBy = 'date'" class="transition-colors hover:text-[#1E88E5]"
                  :class="sortBy === 'date' ? 'text-[#1E88E5]' : 'text-gray-500'">
            按时间
            <span v-if="sortBy === 'date'" class="block h-[3px] w-full bg-[#1E88E5] mt-1 rounded-full"></span>
          </button>
        </div>
      </div>

      <!--
      <div class="flex flex-col gap-3 min-h-[500px]">

        <div
            v-for="anime in animeList"
            :key="anime.id"
            @click="goToDetail"
            class="group relative flex items-center gap-6 p-4 rounded-sm border border-white/60 bg-white/40 backdrop-blur-md shadow-sm hover:bg-white/80 hover:border-[#1E88E5]/30 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
          <div class="relative w-20 h-28 flex-shrink-0 bg-gray-200 rounded-sm overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
            <img v-if="anime.img" :src="anime.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"/>
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">NO IMG</div>
          </div>

          <div class="flex-1 flex flex-col gap-1.5 z-10 min-w-0">
            <h3 class="text-xl font-black text-gray-900 group-hover:text-[#1E88E5] transition-colors tracking-tight truncate w-[90%]">
              {{ anime.title }}
            </h3>
            <p class="text-xs font-bold text-gray-500 font-mono mb-1 truncate">{{ anime.alias }}</p>
            <div class="flex flex-wrap gap-2">
              <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-white/50 border border-gray-300 text-gray-600 tracking-wide backdrop-blur-sm">
                {{ anime.year }}
              </span>
              <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-[#1E88E5]/10 border border-[#1E88E5]/30 text-[#1E88E5] tracking-wide backdrop-blur-sm">
                {{ anime.season }}番
              </span>
              <span v-for="tag in anime.tags" :key="tag"
                    class="text-[10px] font-bold px-3 py-1 rounded-sm border border-gray-300 text-gray-500 bg-white/30 backdrop-blur-sm">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="text-right z-0 pr-4">
            <div class="text-6xl font-black italic tracking-tighter text-gray-300 leading-none group-hover:text-[#1E88E5] group-hover:scale-110 transition-all duration-300 origin-right drop-shadow-sm">
              <span class="text-3xl align-top opacity-50 mr-1">#</span>{{ anime.rank }}
            </div>
            <div class="text-xs font-bold text-gray-400 tracking-widest mt-1 mr-1 group-hover:text-blue-400 transition-colors uppercase">
              Score {{ anime.score }}
            </div>
          </div>
        </div>

        <div v-if="animeList.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-lg font-bold">暂无相关数据</p>
          <p class="text-xs mt-1">NO DATA AVAILABLE</p>
          <p class="text-[10px] mt-2 text-gray-300">请检查控制台(F12) API 是否报错</p>
        </div>

      </div>
      -->

      <div class="relative flex flex-col gap-3 min-h-[500px]">

        <div
            v-if="isLoading"
            class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px] rounded-lg transition-all duration-300"
        >
          <div class="relative flex items-center justify-center">
            <div class="absolute w-20 h-20 rounded-full border-[6px] border-[#1E88E5]/20"></div>
            <div class="w-20 h-20 rounded-full border-[6px] border-t-[#1E88E5] border-r-[#1E88E5] border-b-transparent border-l-transparent animate-spin shadow-[0_0_20px_rgba(30,136,229,0.4)]"></div>
          </div>

          <div class="mt-4 text-[#1E88E5] font-black italic tracking-widest text-sm animate-pulse">
            LOADING DATA...
          </div>
        </div>

        <div
            class="flex flex-col gap-3 transition-all duration-300"
            :class="isLoading ? 'blur-sm opacity-60 pointer-events-none' : 'blur-0 opacity-100'"
        >
          <div
              v-for="anime in animeList"
              :key="anime.id"
              @click="goToDetail(anime.id)"
              class="group relative flex items-center gap-6 p-4 rounded-sm border border-white/60 bg-white/40 backdrop-blur-md shadow-sm hover:bg-white/80 hover:border-[#1E88E5]/30 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div class="relative w-20 h-28 flex-shrink-0 bg-gray-200 rounded-sm overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
              <img v-if="anime.img" :src="anime.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"/>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">NO IMG</div>
            </div>

            <div class="flex-1 flex flex-col gap-1.5 z-10 min-w-0">
              <h3 class="text-xl font-black text-gray-900 group-hover:text-[#1E88E5] transition-colors tracking-tight truncate w-[90%]">
                {{ anime.title }}
              </h3>
              <p class="text-xs font-bold text-gray-500 font-mono mb-1 truncate">{{ anime.alias }}</p>
              <div class="flex flex-wrap gap-2">
                  <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-white/50 border border-gray-300 text-gray-600 tracking-wide backdrop-blur-sm">
                    {{ anime.year }}
                  </span>
                <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-[#1E88E5]/10 border border-[#1E88E5]/30 text-[#1E88E5] tracking-wide backdrop-blur-sm">
                    {{ anime.season }}番
                  </span>
                <span v-for="tag in anime.tags" :key="tag"
                      class="text-[10px] font-bold px-3 py-1 rounded-sm border border-gray-300 text-gray-500 bg-white/30 backdrop-blur-sm">
                    {{ tag }}
                  </span>
              </div>
            </div>

            <div class="text-right z-0 pr-4">
              <div class="text-6xl font-black italic tracking-tighter text-gray-300 leading-none group-hover:text-[#1E88E5] group-hover:scale-110 transition-all duration-300 origin-right drop-shadow-sm">
                <span class="text-3xl align-top opacity-50 mr-1">#</span>{{ anime.rank }}
              </div>
              <div class="text-xs font-bold text-gray-400 tracking-widest mt-1 mr-1 group-hover:text-blue-400 transition-colors uppercase">
                Score {{ anime.score }}
              </div>
            </div>
          </div>

          <div v-if="animeList.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-lg font-bold">暂无相关数据</p>
            <p class="text-xs mt-1">NO DATA AVAILABLE</p>
            <p class="text-[10px] mt-2 text-gray-300">请检查控制台(F12) API 是否报错</p>
          </div>

        </div>

      </div>

      <div class="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-300/50 pt-8">
        <div class="flex items-center gap-3">
          <span class="text-xs font-black text-gray-400 uppercase tracking-wider">ROWS PER PAGE</span>
          <div class="relative group">
            <select v-model="pageSize" class="appearance-none bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 font-bold text-sm pl-4 pr-10 py-2 rounded-sm focus:outline-none focus:border-[#1E88E5] transition-all cursor-pointer hover:border-[#1E88E5]">
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
              class="w-10 h-10 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              class="relative w-10 h-10 rounded-sm font-bold text-sm transition-all duration-300 border flex items-center justify-center group"
              :class="currentPage === page
      ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)] z-10 scale-105'
      : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-white/50'"
          >
            {{ page }}
            <div v-if="currentPage === page"
                 class="absolute bottom-0 right-0 w-0 h-0 border-b-[6px] border-r-[6px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[6px] border-l-transparent border-t-[6px] border-t-transparent opacity-80">
            </div>
          </button>

          <div class="relative w-10 h-10">
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
                title="输入页码"
            >
              ...
            </button>
          </div>

          <button
              @click="currentPage++"
              class="w-10 h-10 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>










      </div>
    </div>






    <div class="w-full md:w-1/4 relative">
      <div class="sticky top-24 space-y-10">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-6 bg-[#1E88E5]"></div>
          <h3 class="text-xl font-black italic text-gray-800">筛选条件</h3>
        </div>

        <div>
          <div class="text-xs font-black text-gray-400 tracking-wider mb-4">年份</div>
          <div class="grid grid-cols-3 gap-2 relative z-10">
            <button
                v-for="year in presetYears"
                :key="year"
                @click="handleYearClick(year)"
                class="relative py-2 text-xs font-bold rounded-sm transition-all duration-300 border group"
                :class="selectedYear === year
                ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)]'
                : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'"
            >
              {{ year }}
              <div v-if="selectedYear === year" class="absolute bottom-0 right-0 w-0 h-0 border-b-[6px] border-r-[6px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[6px] border-l-transparent border-t-[6px] border-t-transparent opacity-80"></div>
            </button>

            <button
                @click="handleYearClick('更早')"
                class="relative py-2 text-xs font-bold rounded-sm transition-all duration-300 border group"
                :class="isEarlierActive
                ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)]'
                : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'"
            >
              更早
              <div v-if="isEarlierActive" class="absolute bottom-0 right-0 w-0 h-0 border-b-[6px] border-r-[6px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[6px] border-l-transparent border-t-[6px] border-t-transparent opacity-80"></div>
            </button>
          </div>

          <div class="transition-all duration-300 ease-out overflow-hidden"
               :class="isEarlierActive ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'">
            <div class="relative flex items-center">
              <input
                  v-model.lazy="selectedYear"
                  type="number"
                  placeholder="输入年份"
                  class="w-full py-2 px-4 text-xs font-bold text-[#1E88E5] bg-[#1E88E5]/5 border border-[#1E88E5] rounded-sm outline-none placeholder-gray-400 transition-all shadow-[0_0_15px_rgba(30,136,229,0.10)] text-center"
              />
              <span class="absolute right-3 text-[10px] text-[#1E88E5]/60 font-bold pointer-events-none">YEAR</span>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-300/50">
          <div class="text-[10px] text-gray-400 font-bold font-mono">STATUS: DEBUG MODE</div>
        </div>
      </div>
    </div>
  </div>
</template>