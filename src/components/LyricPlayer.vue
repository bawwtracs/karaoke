<template>
  <div class="lyric">
    <div v-for="(item, idx) in arr" v-show="item.show" :key="idx" :class="{'current': idx==current, 'line': true}">
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import Lyric from 'lyric-parser'

export default {
  name: 'LyricPlayer',
  components: {
  },
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    lyricArr: {
      type: Array,
      default() {
        return []
      }
    },
    rows: {
      type: Number,
      default() {
        return 12
      }
    }
  },
  data() {
    return {
      current: 0,
      lyric: null
    }
  },
  computed: {
    arr() {
      return this.lyricArr.map((item, idx) => {
        if (idx < this.rows && this.current < this.rows) {
          return { text: item.replace(/\[.*\]/g, ''), show: true }
        }
        if (idx > this.current - Math.ceil(this.rows / 2) && idx < this.current + Math.ceil(this.rows / 2) + 1) {
          return { text: item.replace(/\[.*\]/g, ''), show: true }
        } else {
          return { text: '', show: false }
        }
      })
    }
  },
  mounted() {
    this.lyric = new Lyric(this.lyricArr.join('\n'), (handler) => {
      this.current = handler.lineNum
      // console.log(this.current)
    })
  },
  unmounted() {
    this.lyric = null
  },
  methods: {
    play() {
      // console.log('lyric start')
      this.lyric.seek(0)
      this.lyric.play()
    },
    toggle() {
      // console.log('lyric toggle')
      this.lyric.togglePlay()
    },
    stop() {
      // console.log('lyric stop')
      this.current = 0
      this.lyric.seek(0)
      this.lyric.stop()
    }
  }
}
</script>

<style lang="less" scoped>
.lyric{
  padding: .5rem 0;
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  justify-content: space-between;

  .current{
    color: #fff
  }
}
</style>
