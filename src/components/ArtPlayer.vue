<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Artplayer from 'artplayer'
import Hls from 'hls.js'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  style: {
    type: Object,
    default: () => ({
      width: '100%',
      height: '100%',
    }),
  },
})

const artRef = ref(null)
const instance = ref(null)

// 初始化播放器逻辑
const initPlayer = () => {
  // 销毁旧实例
  if (instance.value) {
    instance.value.destroy(false)
  }

  // 默认配置 + 传入配置
  const conf = {
    container: artRef.value,
    volume: 0.5,
    isLive: false,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: true,
    autoMini: true,
    screenshot: true,
    setting: true,
    loop: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    theme: '#1E88E5', // 配合你网站的主题色
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
      crossOrigin: 'anonymous', // 允许跨域
    },
    customType: {
      m3u8: function (video, url, art) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy();

          const hls = new Hls({
            xhrSetup: function (xhr, url) {

            }
          });

          hls.loadSource(url);
          hls.attachMedia(video);
          art.hls = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // 针对原生支持的环境 (Safari)
          video.src = url;
          // 尝试设置属性
          video.referrerPolicy = "no-referrer";
        }
      },
    },
    ...props.option, // 合并传入的配置，主要是 url
  }

  instance.value = new Artplayer(conf)
}

// 监听 url 变化，切换视频
watch(() => props.option.url, (newUrl) => {
  if (instance.value && newUrl) {
    instance.value.switchUrl(newUrl)
  }
})

onMounted(() => {
  nextTick(() => {
    initPlayer()
  })
})

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.destroy(false)
  }
})
</script>

<template>
  <div ref="artRef" :style="style"></div>
</template>