<template>
  <div class="recorder" />
</template>

<script>
// https://github.com/2fps/recorder
import Recorder from 'js-audio-recorder'

export default {
  name: 'Karaoke',
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      recorder: null,
      pausing: false
    }
  },
  mounted() {
    this.init()
  },
  beforeUnmount() {
    this.destroy()
  },
  methods: {
    init() {
      this.recorder = new Recorder(this.options)
      this.recorder.onprogress = (params) => {
        if (this.debug) {
          console.log('duraion(s)', params.duration)
          console.log('size(b)', params.fileSize)
          console.log('vol(%)', params.vol)
        }
      }
      this.recorder.onplayend = () => {
        this.$emit('onplayend')
      }
    },
    destroy() {
      const that = this
      this.recorder.destroy().then(() => {
        that.recorder = null
      })
    },
    start() {
      return this.recorder.start()
    },
    toggle() {
      // console.log('record toggle')
      this.pausing ? this.resume() : this.pause()
      this.pausing = !this.pausing
    },
    pause() {
      this.recorder.pause()
    },
    resume() {
      this.recorder.resume()
    },
    stop() {
      // console.log('record stop')
      this.recorder.stop()
    },
    play() {
      // console.log('record play')
      this.recorder.play()
    },
    pausePlay() {
      // console.log('record pause play')
      this.recorder.pausePlay()
    },
    resumePlay() {
      // console.log('record resume play')
      this.recorder.resumePlay()
    }
  }
}
</script>
