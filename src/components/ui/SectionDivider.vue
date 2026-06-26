<script setup>
// Пунктирная линия-разделитель между секциями (картинка dashed-line.png).
</script>

<template>
  <div class="section-divider" role="separator" aria-hidden="true"></div>
</template>

<style scoped>
.section-divider {
  width: 100%;
  height: 4px;
  background-image: url('/images/dashed-line.png');
  background-repeat: repeat-x;
  background-size: auto 4px;
  background-position: center;
}
</style>
