<template>
  <div class="lyric">
    <div v-for="(item, idx) in arr" v-show="item.show" :key="idx" :class="{'active': idx===current, 'line': true}">
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
      current: -1,
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
  watch: {
    lyricArr: {
      handler(val) {
        this.init(val.join('\n'))
      },
      deep: true
    }
  },
  mounted() {
    this.init(this.lyricArr.join('\n'))
  },
  methods: {
    init(val) {
      if (this.lyric) {
        this.lyric.stop()
      }
      this.lyric = new Lyric(val, (handler) => {
        this.current = handler.lineNum
        // console.log(this.current)
      })
    },
    play() {
      // console.log('lyric start')
      this.lyric.play()
    },
    toggle() {
      // console.log('lyric toggle')
      this.lyric.togglePlay()
    },
    stop() {
      // console.log('lyric stop')
      this.current = -1
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
  justify-content: space-around;

  .active{
    color: #fff
  }
}
</style>
