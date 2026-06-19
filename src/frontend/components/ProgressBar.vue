<template>
  <div class="progress-wrap">
    <div class="progress-fill" :style="{ width: `${progress}%` }" />
    <span class="progress-label">{{ progress }}%</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ progress: number }>()
</script>

<style scoped>
.progress-wrap  { position: relative; background: #e2e8f0; border-radius: 8px; height: 18px; overflow: hidden; min-width: 80px; }
.progress-fill  { height: 100%; background: linear-gradient(90deg, #4299e1, #48bb78); transition: width 0.5s ease; }
.progress-label { position: absolute; right: 6px; top: 0; font-size: 0.7rem; line-height: 18px; color: #2d3748; font-weight: 700; }
</style>