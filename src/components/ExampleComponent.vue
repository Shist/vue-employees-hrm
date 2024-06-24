<template>
  <div class="example-component">
    <h2 class="example-component__headline">Headline of example component</h2>
    <span class="example-component__text">This is example component</span>
    <img src="@/assets/images/example-img.png" alt="example image" />
    <h2 class="example-component__headline">This is default button:</h2>
    <button class="example-component__default-btn">Default button</button>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scopped>
.example-component {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__headline {
    @include default-headline(48px, 48px);
  }
  &__text {
    @include default-text(36px, 36px);
  }
  &__default-btn {
    @include default-btn(300px, 20px, 20px);
    padding: 16px;
    text-transform: uppercase;
  }
}
</style>
