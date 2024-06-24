<template>
  <div class="example-component">
    <h2 class="example-component__headline">Headline of example component</h2>
    <span class="example-component__text">This is example component</span>
    <img src="@/assets/example-img.png" alt="example image" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.example-component {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__headline {
    font-weight: 700;
    font-size: 48px;
    line-height: 48px;
    color: #000000;
  }
  &__text {
    font-size: 36px;
    line-height: 36px;
    color: #000000;
  }
}
</style>
