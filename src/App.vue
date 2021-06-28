<template>
  <Karaoke style="height: 100vh;" />
</template>

<script>
import Karaoke from './components/Karaoke.vue'

export default {
  name: 'App',
  components: {
    Karaoke
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
