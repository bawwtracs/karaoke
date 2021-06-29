<template>
  <Karaoke style="height: 100vh;" :options="options" />
</template>

<script>
import Karaoke from './components/Karaoke.vue'

export default {
  name: 'App',
  components: {
    Karaoke
  },
  data() {
    return {
      options: {
        wrapperStyle: 'background: linear-gradient(to right bottom, rgb(232, 203, 192), rgb(99, 111, 164))'
      }
    }
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
