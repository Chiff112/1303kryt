<script setup>
/**
 * SectionDivider — full-width dashed separator line.
 * Uses the original `dashed-line.png` asset from the design so the
 * dotted pattern matches the site exactly.
 *
 * Placed at the start and/or end of page sections.
 */
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
