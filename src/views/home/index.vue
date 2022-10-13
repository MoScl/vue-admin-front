<template>
  <div>
    home
    <el-button type="primary">Primary</el-button>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(() => {
    ElMessage.success('Congrats, this is a success message.')
  })
  </script>

<style lang="scss" scoped>
div {
  color: var(--el-color-primary);
}
</style>

  