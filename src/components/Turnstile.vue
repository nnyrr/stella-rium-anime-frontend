<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// 定义 Props：接收 siteKey
const props = defineProps({
  siteKey: {
    type: String,
    required: true
  }
})

// 定义 Emits：向父组件传递 token
const emit = defineEmits(['verify'])

const widgetId = ref(null)
const turnstileContainer = ref(null)

onMounted(() => {
  // 确保 window.turnstile 已经加载
  if (window.turnstile) {
    renderWidget()
  } else {
    // 如果脚本还没加载完，监听一下（保险起见）
    // 实际项目中通常 index.html 加载很快，可以直接用
    setTimeout(renderWidget, 1000)
  }
})

const renderWidget = () => {
  if (!turnstileContainer.value) return

  // 渲染 Turnstile
  widgetId.value = window.turnstile.render(turnstileContainer.value, {
    sitekey: props.siteKey,
    callback: (token) => {
      console.log('Turnstile 验证成功:', token)
      emit('verify', token) // 把 token 发给父组件
    },
    'expired-callback': () => {
      emit('verify', null) // 过期重置
    }
  })
}

// 这是一个重置方法，暴露给父组件（如果注册失败，可以重置验证码）
const reset = () => {
  if (widgetId.value) {
    window.turnstile.reset(widgetId.value)
  }
}

defineExpose({ reset })
</script>

<template>
  <div ref="turnstileContainer" class="min-h-[65px]"></div>
</template>