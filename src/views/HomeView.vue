<script setup>
import TheWelcome from '@/components/TheWelcome.vue'
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

<template>
  <main>
    <TheWelcome />
  </main>
</template>
