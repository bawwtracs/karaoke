<template>
  <div class="music-player">
    <div ref="aplayer" />
  </div>
</template>

<script>
import 'aplayer/dist/APlayer.min.css'
// https://github.com/DIYgod/APlayer
import APlayer from 'aplayer'

export default {
  name: 'MusicPlayer',
  components: {
  },
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      aplayer: null
    }
  },
  watch: {
    songs: {
      handler() {
        this.reload()
      },
      deep: true
    },
    idx(val) {
      this.switch(val)
    }
  },
  mounted() {
    this.init()
  },
  beforeUnmount() {
    this.destroy()
  },
  methods: {
    reload() {
      this.destroy()
      this.init()
    },
    init() {
      this.aplayer = new APlayer({
        container: this.$refs.aplayer,
        fixed: false,
        mini: false,
        autoplay: false,
        theme: '#b7daff',
        loop: 'none',
        order: '曲线救国',
        preload: 'auto',
        volume: '0.6',
        audio: this.songs,
        mutex: true,
        lrcType: 0,
        listFolded: true,
        listMaxHeight: 0,
        storageName: 'aplayer-setting'
      })
      this.aplayer.on('ended', () => {
        // console.log('music end')
        this.$emit('end')
      })
      this.aplayer.on('play', () => {
        // console.log('music play')
        this.$emit('play')
      })
      this.aplayer.on('pause', () => {
        // console.log('music pause')
        this.$emit('pause')
      })
    },
    switch(val) {
      this.aplayer.list.switch(val)
    },
    destroy() {
      this.aplayer.destroy()
    },
    play() {
      this.aplayer.seek(0)
      this.aplayer.play()
    },
    pause() {
      this.aplayer.pause()
    },
    resume() {
      this.aplayer.play()
    }
  }
}
</script>

<style lang="less">
.aplayer-controller{
  justify-content: center;
  .aplayer-bar-wrap{
    display: none;
  }
}
.aplayer-icon-order, .aplayer-icon-loop, .aplayer-icon-menu{
  display: none!important;
}
</style>
