<template>
  <div class="empty-avatar">
    <span class="empty-avatar__letter">{{ letter }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  letter: string;
}>();
</script>

<style lang="scss" scoped>
.empty-avatar {
  height: 120px;
  width: 120px;
  &__letter {
  }
}
</style>
