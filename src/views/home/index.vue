<template>
  <div>
    home
    <el-button type="primary" @click="handlerClick">home</el-button>
  </div>
</template>

<script setup>
  const handlerClick = () => {
    ElMessage.success('Congrats, this is a success message.')
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
div {
  color: var(--el-color-primary);
}
</style>

  