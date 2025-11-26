/**
 * 错误弹窗 (红色机能风)
 */
export const showErrorToast = (code, message) => {
    createToast(code, message, 'error')
}

/**
 * 成功弹窗 (蓝色机能风) - 新增
 */
export const showSuccessToast = (code, message) => {
    createToast(code, message, 'success')
}

// 内部通用构建函数
const createToast = (code, message, type) => {
    const isError = type === 'error'

    // 颜色配置
    const borderColor = isError ? 'border-red-500' : 'border-[#1E88E5]'
    const shadowColor = isError ? 'shadow-red-500/10' : 'shadow-[#1E88E5]/10'
    const titleColor = isError ? 'text-red-500' : 'text-[#1E88E5]'
    const borderSoft = isError ? 'border-red-200' : 'border-blue-200'

    // 1. 创建容器
    const div = document.createElement('div')
    div.id = 'toast-' + Date.now()

    // 2. 设置 Tailwind 样式
    div.className = `
    fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
    flex items-center gap-4
    px-6 py-3.5
    bg-white/95 backdrop-blur-xl
    border ${borderSoft} border-l-4 ${borderColor}
    rounded-sm shadow-2xl ${shadowColor}
    text-sm font-bold tracking-wide text-gray-800
    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
    transform -translate-y-[200%] opacity-0
  `

    // 3. 注入 HTML 内容
    div.innerHTML = `
    <div class="flex flex-col">
      <span class="text-[10px] font-black ${titleColor} uppercase tracking-widest leading-none mb-0.5">
        ${isError ? 'ERROR' : 'SUCCESS'} // ${code}
      </span>
      <span class="text-gray-700 font-bold truncate max-w-xs">${message}</span>
    </div>
    <button class="text-gray-400 hover:text-gray-800 transition-colors ml-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `

    // 4. 挂载
    document.body.appendChild(div)

    // 5. 动画
    requestAnimationFrame(() => {
        div.classList.remove('-translate-y-[200%]', 'opacity-0')
    })

    // 6. 销毁
    const remove = () => {
        div.classList.add('-translate-y-[200%]', 'opacity-0')
        setTimeout(() => {
            if (div.parentElement) div.parentElement.removeChild(div)
        }, 500)
    }

    div.querySelector('button').onclick = remove
    setTimeout(remove, 3000)
}