<template>
  <div>
    login
  </div>
</template>

<script setup>
  import api from '@/api/data'
  import { onMounted } from 'vue'
  
  const getData = async() => {
    const res = await api.getData({})
    console.log(res)
  }
  onMounted(() => {
    getData()
  })
  </script>

  