/**
 * 极简风顶部弹窗
 * @param {string} code - 错误码 (如 404, 500, Auth Error)
 * @param {string} message - 错误详情
 */
export const showErrorToast = (code, message) => {
    // 1. 创建容器
    const div = document.createElement('div')
    div.id = 'error-toast-' + Date.now()

    // 2. 设置 Tailwind 样式
    // 风格：顶部居中、毛玻璃、红色边框高亮、阴影、初始位置在屏幕外(-translate-y-full)
    div.className = `
    fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
    flex items-center gap-4
    px-6 py-3.5
    bg-white/90 backdrop-blur-xl
    border border-red-200 border-l-4 border-l-red-500
    rounded-sm shadow-2xl shadow-red-500/10
    text-sm font-bold tracking-wide text-gray-800
    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
    transform -translate-y-[200%] opacity-0
  `

    // 3. 注入 HTML 内容 (机能风排版)
    div.innerHTML = `
    <div class="flex flex-col">
      <span class="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-0.5">ERROR // ${code}</span>
      <span class="text-gray-700 font-bold truncate max-w-xs">${message}</span>
    </div>
    <button class="text-gray-400 hover:text-gray-800 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `

    // 4. 挂载到 Body
    document.body.appendChild(div)

    // 5. 触发进场动画 (加一点延迟让浏览器渲染)
    requestAnimationFrame(() => {
        div.classList.remove('-translate-y-[200%]', 'opacity-0')
    })

    // 6. 定义销毁逻辑
    const remove = () => {
        div.classList.add('-translate-y-[200%]', 'opacity-0')
        setTimeout(() => {
            if (div.parentElement) div.parentElement.removeChild(div)
        }, 500) // 等待动画结束
    }

    // 点击关闭
    div.querySelector('button').onclick = remove

    // 3秒后自动消失
    setTimeout(remove, 3000)
}