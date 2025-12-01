<script setup>
defineProps({
  title: String,
  score: String,
  image: String,
  tag: String,
  year: String
})
</script>

<template>
  <div class="group relative w-full aspect-[2/3] overflow-hidden cursor-pointer bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

    <img
        :src="image"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
        loading="lazy"
    />

    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

    <div class="absolute top-0 right-4 z-10">
      <span class="text-4xl font-black italic text-white tracking-tighter drop-shadow-2xl select-none opacity-90 group-hover:opacity-100 transition-opacity">
        {{ score }}
      </span>
    </div>

    <div class="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-10">

      <h3 class="text-lg font-bold text-white mb-1 truncate group-hover:text-[#1E88E5] transition-colors duration-300 drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform">
        {{ title }}
      </h3>

      <div class="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 delay-75 overflow-hidden">
        <div class="pt-3 flex flex-col gap-2">

          <div class="w-6 h-[3px] bg-[#1E88E5]"></div>

          <div class="flex justify-between items-end">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-300 uppercase tracking-wider">{{ tag || 'ANIME' }}</span>
              </div>
              <span class="text-[10px] text-gray-500 font-mono font-bold">{{ year }}</span>
            </div>

            <div class="text-[#1E88E5] transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>