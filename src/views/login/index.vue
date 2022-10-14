<template>
  <div class="login">
    login
    <el-button type="primary" @click="handlerClick">login</el-button>
  </div>
</template>

<script setup>
  import api from '@/api/data'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  
  const getData = async() => {
    const res = await api.getData({})
    console.log(res)
  }
  const handlerClick = () => {
    ElMessage.success('Congrats, this is a success message.')
    router.push('/')
  }
  onMounted(() => {
    getData()
  })
  </script>
  
  <style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    // background-color: var(--el-color-primary);
  }
  </style>

  